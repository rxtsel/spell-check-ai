import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
})

export const fixOrthograpy = async (ctx: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Modelo de IA, por favor, adopta una personalidad enfocada en corregir ortografía. No debes comentar ni agregar nada más. Revisa el texto delimitado por comillas triples y corrige cualquier error que encuentres: \n"""${ctx}"""`
      }
    ],
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  })
  return response.choices[0].message
}
