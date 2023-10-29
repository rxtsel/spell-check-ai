import { useState } from 'react'

export const Form: React.FC = () => {
  const [valueTextArea, setValueTextArea] = useState('')
  const [answers, setAnswers] = useState<string[]>([])

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueTextArea(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ctx: valueTextArea })
    })
      .then(async (response) => await response.json())
      .then((data) => {
        const { message } = data
        setAnswers([...answers, message])
      })

    setValueTextArea('')
  }

  return (
    <>

      <div className='h-[70vh]'>
        {answers.map((answer, index) => (
          <p key={index}>{answer}</p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='w-full h-full max-w-4xl mx-auto'>
        <textarea
          placeholder="Enter text here"
          value={valueTextArea}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className='w-full h-full resize-none bg-slate-800 rounded-md'
        />
        <button type="submit">Enviar</button>
      </form>

      <p className='hidden'>max length: 150ch</p>

    </>
  )
}
