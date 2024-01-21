import { useState } from 'react'
import { Robot, User } from '../assets/icons'
import { Loader } from './Loader'
import { Toast } from './Toast'

type Role = 'assistant' | 'user'

interface Message {
  id: string
  role: Role
  message: string
}

export const Form: React.FC = () => {
  const [valueTextArea, setValueTextArea] = useState('')
  const [answers, setAnswers] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(false)

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValueTextArea(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    handleSubmit()
  }

  const handleSubmit = () => {
    if (valueTextArea.length === 0) return

    setLoading(true)

    answers.push({
      id: crypto.randomUUID(),
      role: 'user',
      message: valueTextArea
    })

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ctx: valueTextArea })
    })
      .then(async (response) => await response.json())
      .then((data) => {
        const { content, role } = data.message

        const dataWithRole = [
          ...answers,
          {
            id: crypto.randomUUID(),
            role,
            message: content.replace(/^"|"$/g, '')
          }
        ]

        setAnswers(dataWithRole)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
        sclollToBottom()
      })

    setValueTextArea('')
  }

  const handleCopyToClipboard = (id: string) => {
    const message = answers.find((answer) => answer.id === id)?.message

    if (message !== null && message !== undefined) {
      navigator.clipboard.writeText(message)
    }

    setAlert(true)
    setTimeout(() => {
      setAlert(false)
    }, 4000)
  }

  const sclollToBottom = () => {
    const element = document.querySelector('#messages-section')

    if (element === null || element === undefined) return

    setTimeout(() => {
      element.scroll({
        top: element.scrollHeight - element.clientHeight,
        behavior: 'smooth'
      })
    }, 100)
  }

  return (
    <section
      id="messages-section"
      className="border-t border-l border-r border-zinc-700 w-full max-w-3xl mx-auto rounded-t-3xl h-full flex flex-col shadow p-4 md:p-10 overflow-x-hidden overflow-y-auto relative bottom-0"
    >
      <Toast show={alert} />

      <ul className="h-full flex flex-col space-y-4">
        <li className="flex items-start space-x-4">
          <div className="w-12 h-12 text-white border border-purple-500/20 shadow-inner shadow-purple-500 rounded-full p-3 flex items-center justify-center">
            <Robot />
          </div>
          <p className="bg-zinc-900 rounded-xl max-w-full md:max-w-max px-5 py-4">
            ¡Hola! Soy un bot que te ayudará a corregir tu ortografía. Puedes
            escribirme y te ayudaré a corregir tus errores.
          </p>
        </li>

        {answers.map((answer, index) => (
          <li
            key={index}
            className={`message flex items-start gap-4 ${
              answer.role === 'user' ? 'self-end' : 'cursor-pointer'
            }`}
            {...(answer.role === 'assistant' && {
              onClick: () => {
                handleCopyToClipboard(answer.id)
              }
            })}
          >
            <div
              className={`w-12 h-12 text-white border shadow-inner rounded-full p-3 flex items-center justify-center ${
                answer.role === 'user'
                  ? 'border-sky-500/20 shadow-sky-500 order-2'
                  : 'border-purple-500/20 shadow-purple-500'
              }`}
            >
              {answer.role === 'assistant' ? <Robot /> : <User />}
            </div>
            <p className="bg-zinc-900 rounded-xl w-full max-w-full md:max-w-max paragraph px-5 py-4 text-pretty whitespace-break-spaces">
              {answer.message}
            </p>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-5 left-0 right-0 flex w-full max-w-xs md:max-w-lg mx-auto max-h-14"
      >
        <textarea
          placeholder="Ingresa tu texto aquí"
          value={valueTextArea}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="outline-none resize-none bg-zinc-900 h-auto w-full rounded-full dark:text-slate-100 p-4 pr-[70px]"
        />
        <button
          className={`rounded-full bg-purple-500 absolute bottom-0 right-0 h-full px-5 min-w-[86.63px] flex items-center justify-center ${
            loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          disabled={loading}
          onClick={handleClick}
        >
          {loading ? <Loader /> : <span className="text-white">Enviar</span>}
        </button>
      </form>

      <p className="hidden">max length: 150ch</p>
    </section>
  )
}
