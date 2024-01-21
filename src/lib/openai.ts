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
        content: `Actúa como una herramienta de corrección ortográfica. Te proporcionaré un fragmento de texto con posibles errores ortográficos, y tu tarea es identificar y corregir esos errores. Si el texto necesita salto de líneas, siéntete en la libertadde ponerlos. Por favor, revisa el siguiente texto que está dentro de  los signos "<>" y no respondas absolutamente nada más que no sea el texto corregido:\n\n<${ctx}>\n\n`
      }
    ],
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  })
  return response.choices[0].message
}
