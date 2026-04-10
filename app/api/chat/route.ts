import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSchools, getServiceTypes, getPricesWithDetails } from '@/lib/queries'
import type { School, ServiceType, PriceWithDetails } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Cache school context for 5 minutes to avoid hitting Supabase on every message
let cachedContext: string | null = null
let cacheExpiry = 0

function buildContext(schools: School[], _serviceTypes: ServiceType[], prices: PriceWithDetails[]): string {
  let ctx = 'KÖRSKOLOR I VÄXJÖ:\n'
  for (const school of schools) {
    ctx += `\n• ${school.name} — ${school.address}`
    if (school.phone) ctx += ` | Tel: ${school.phone}`
    if (school.website) ctx += ` | Webb: ${school.website}`
    ctx += '\n'
    const schoolPrices = prices.filter(p => p.school_id === school.id)
    for (const price of schoolPrices) {
      const mins = price.lesson_minutes ? ` (${price.lesson_minutes} min/lektion)` : ''
      ctx += `   - ${price.service_type.label}: ${price.amount_sek.toLocaleString('sv-SE')} kr${mins}\n`
    }
  }
  return ctx
}

async function getContext(): Promise<string> {
  if (cachedContext && Date.now() < cacheExpiry) {
    return cachedContext
  }
  const [schools, serviceTypes, prices] = await Promise.all([
    getSchools(),
    getServiceTypes(),
    getPricesWithDetails(),
  ])
  cachedContext = buildContext(schools, serviceTypes, prices)
  cacheExpiry = Date.now() + 5 * 60 * 1000 // 5 minutes
  return cachedContext
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const context = await getContext()

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: `Du är en hjälpsam AI-assistent för Körkollen — en tjänst som jämför priser mellan körskolor i Växjö, Sverige.

Din uppgift:
- Hjälp användare hitta rätt körskola baserat på deras behov och budget
- Jämför priser tydligt och konkret
- Rekommendera körskolor baserat på pris, kontaktinfo och tillgängliga tjänster
- Svara alltid på svenska, var kort och tydlig

${context}

Om du inte vet svaret på en fråga som inte rör körskolor, hänvisa artigt tillbaka till körskolor i Växjö.`,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    const msg = error instanceof Error ? error.message : 'Okänt fel'
    return new Response(`Något gick fel: ${msg}`, { status: 500 })
  }
}
