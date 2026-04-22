import { useCallback, useState } from "react"

type GeolocationStatus = "idle" | "loading" | "success" | "error"

interface UseGeolocationReturn {
  lat: number | null
  lng: number | null
  accuracy: number | null
  status: GeolocationStatus
  getPosition: () => void
}

export function useGeolocation(): UseGeolocationReturn {
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [status, setStatus] = useState<GeolocationStatus>("idle")

  const getPosition = useCallback((): void => {
    if (!navigator.geolocation) {
      setStatus("error")
      return
    }

    setStatus("loading")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setAccuracy(position.coords.accuracy)
        setStatus("success")
      },
      () => {
        setStatus("error")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  return {
    lat,
    lng,
    accuracy,
    status,
    getPosition,
  }
}
