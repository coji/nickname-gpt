import { useState } from 'react'

export const useGenerate = () => {
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generate = async (input: string) => {
    setIsLoading(true)
    setResult('')

    const formData = new FormData()
    formData.set('input', input)
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      setIsLoading(false)
      throw new Error(response.statusText)
    }

    const data = response.body
    if (!data) {
      setIsLoading(false)
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setResult((prev) => prev + chunkValue)
    }

    setIsLoading(false)
  }

  return {
    result,
    isLoading,
    generate,
  }
}
