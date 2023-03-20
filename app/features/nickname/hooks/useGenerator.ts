import { useState } from 'react'

export const useGenerator = () => {
  const [result, setResult] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const generate = async (input: string) => {
    setIsLoading(true)
    setResult('')

    const formData = new FormData()
    formData.set('input', input)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      }).catch((e) => {
        console.log('fetch error:', e)
        return null
      })

      if (!response || !response.ok) {
        throw new Error(response?.statusText)
      }

      const data = response.body
      if (!data) {
        throw new Error('empty response')
      }

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        setResult((prev) => prev ?? '' + chunkValue)
      }
    } catch (e) {
      console.log('error', e)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    result,
    isLoading,
    generate,
  }
}
