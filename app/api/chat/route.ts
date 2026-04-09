import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getSchools, getServiceTypes, getPricesWithDetails } from '@/lib/queries'
import type { School, ServiceType, PriceWithDetails } from '@/lib/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function buildContext(schools: School[], serviceTypes: ServiceType[], prices: PriceWithDetails[]): string {
  let ctx = 'KÖRSKOLOR I VÄXJÖ:\n'
  for (const school of schools) {
    ctx += `\n• ${school.name} — ${school.address}\n`
    const schoolPrices = prices.filter(p => p.school_id === school.id)
    for (const price of schoolPrices) {
      const mins = price.lesson_minutes ? ` (${price.lesson_minutes} min/lektion)` : ''
      ctx += `   - ${price.service_type.label}: ${price.amount_sek.toLocaleString('sv-SE')} kr${mins}\n`
    }
  }
  return ctx
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const [schools, serviceTypes, prices] = await Promise.all([
      getSchools(),
      getServiceTypes(),
      getPricesWithDetails(),
    ])

    const context = buildContext(schools, serviceTypes, prices)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Du är en hjälpsam assistent för en jämförelsesite för körskolor i Växjö, Sverige. Hjälp användare hitta rätt körskola utifrån deras behov och budget. Svara alltid på svenska, var kort och tydlig.

${context}`,
        },
        ...messages,
      ],
      max_tokens: 500,
    })

    return NextResponse.json({ message: response.choices[0].message.content })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ message: 'Något gick fel. Försök igen.' }, { status: 500 })
  }
}
