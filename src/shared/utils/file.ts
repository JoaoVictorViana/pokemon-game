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

export const renderSprite = (arrayBufferSprite?: ArrayBuffer) => {
  if (!arrayBufferSprite) return undefined
  const imageBlob = new Blob([arrayBufferSprite], { type: 'image/png' })
  const objectUrl = URL.createObjectURL(imageBlob)
  return objectUrl
}
