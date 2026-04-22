import { useCallback, useRef, useState } from "react"

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isActive: boolean
  error: string | null
  start: () => Promise<void>
  stop: () => void
  takePhoto: () => string | null
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const start = useCallback(async (): Promise<void> => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsActive(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to access camera"
      setError(message)
      setIsActive(false)
    }
  }, [])

  const stop = useCallback((): void => {
    const stream = streamRef.current
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsActive(false)
  }, [])

  const takePhoto = useCallback((): string | null => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      return null
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return null
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/png")
  }, [])

  return {
    videoRef,
    isActive,
    error,
    start,
    stop,
    takePhoto,
  }
}
