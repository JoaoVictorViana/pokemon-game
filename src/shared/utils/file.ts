export async function fetchSpriteAsArrayBuffer(
  url: string
): Promise<ArrayBuffer> {
  if (!url) {
    return new ArrayBuffer()
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Falha ao carregar o sprite de: ${url}`)
  }

  return response.arrayBuffer()
}

export async function fetchAudioAsArrayBuffer(
  url: string
): Promise<ArrayBuffer> {
  if (!url) {
    return new ArrayBuffer()
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Falha ao carregar o cry de: ${url}`)
  }

  return response.arrayBuffer()
}
