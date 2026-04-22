import { useCallback, useEffect, useRef, useState } from "react"

interface DeviceOrientationEventExtended extends DeviceOrientationEvent {
  webkitCompassHeading?: number
  webkitCompassAccuracy?: number
}

type CompassDirection = "北" | "东北" | "东" | "东南" | "南" | "西南" | "西" | "西北"

const DIRECTIONS: CompassDirection[] = [
  "北", "东北", "东", "东南", "南", "西南", "西", "西北",
]

function getDirectionName(heading: number): CompassDirection {
  const normalized = ((heading % 360) + 360) % 360
  const index = Math.round(normalized / 45) % 8
  return DIRECTIONS[index]
}

function normalizeHeading(value: number): number {
  return ((value % 360) + 360) % 360
}

interface UseCompassReturn {
  heading: number
  accuracy: number | null
  isCalibrating: boolean
  isSupported: boolean
  directionName: CompassDirection
  calibrate: () => void
}

export function useCompass(): UseCompassReturn {
  const [heading, setHeading] = useState<number>(0)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false)
  const [isSupported, setIsSupported] = useState<boolean>(false)

  const calibrateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const calibrate = useCallback(() => {
    setIsCalibrating(true)
    if (calibrateTimeoutRef.current) {
      clearTimeout(calibrateTimeoutRef.current)
    }
    calibrateTimeoutRef.current = setTimeout(() => {
      setIsCalibrating(false)
    }, 3000)
  }, [])

  useEffect(() => {
    const checkSupport = (): boolean => {
      if (typeof window === "undefined") return false
      return "DeviceOrientationEvent" in window
    }

    const supported = checkSupport()
    setIsSupported(supported)

    if (!supported) return

    const handleOrientation = (event: DeviceOrientationEvent): void => {
      const e = event as DeviceOrientationEventExtended
      let newHeading: number
      let newAccuracy: number | null = null

      if (e.webkitCompassHeading !== undefined) {
        // iOS
        newHeading = e.webkitCompassHeading
        if (e.webkitCompassAccuracy !== undefined) {
          newAccuracy = Math.abs(e.webkitCompassAccuracy)
        }
      } else if (e.alpha !== null && e.alpha !== undefined) {
        // Android
        newHeading = 360 - e.alpha
      } else {
        return
      }

      const normalized = normalizeHeading(newHeading)
      setHeading(normalized)
      if (newAccuracy !== null) {
        setAccuracy(newAccuracy)
      }
    }

    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
      if (calibrateTimeoutRef.current) {
        clearTimeout(calibrateTimeoutRef.current)
      }
    }
  }, [])

  const directionName = getDirectionName(heading)

  return {
    heading,
    accuracy,
    isCalibrating,
    isSupported,
    directionName,
    calibrate,
  }
}
