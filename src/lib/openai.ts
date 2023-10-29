import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
})

/*
 ** This function will return the ctx fixed orthography
  ** @param {string} ctx - The context to be fixed
  ** @returns {string} - The fixed context
  ** @example
  ** fixOrthograpy('Hola como estas')
  ** // => 'Hola, ¿cómo estás?'
*/
export const fixOrthograpy = async (ctx: string): Promise<string | null> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Actuaras como un experto en gramatica y ortografia. Cuando te escriba algo tu me responderas con lo mismo pero corregido. No agregres cosas. Ni mas ni menos. Este es el texto ${ctx}`
      }
    ],
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  })
  return response.choices[0].message.content
}
