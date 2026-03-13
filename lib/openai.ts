// OpenAI integration stub — wire real data in Phase 2
export interface InsightInput {
  locationId: string
  reportDate: string
  rawData: Record<string, unknown>
}

export interface GeneratedInsight {
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  action_label: string
  action_url: string | null
}

export async function generateInsights(
  input: InsightInput
): Promise<GeneratedInsight[]> {
  // TODO: implement with OpenAI API
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  // const completion = await openai.chat.completions.create({ ... })
  console.log('generateInsights stub called with:', input)
  return []
}
