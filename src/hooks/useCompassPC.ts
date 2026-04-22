import { useCallback, useRef, useState } from "react"

type CompassDirection = "北" | "东北" | "东" | "东南" | "南" | "西南" | "西" | "西北"

const DIRECTIONS: CompassDirection[] = [
  "北", "东北", "东", "东南", "南", "西南", "西", "西北",
]

function getDirectionName(heading: number): CompassDirection {
  const normalized = ((heading % 360) + 360) % 360
  const index = Math.round(normalized / 45) % 8
  return DIRECTIONS[index]
}

interface UseCompassPCReturn {
  heading: number
  directionName: CompassDirection
  isDragging: boolean
  onMouseDown: (event: React.MouseEvent) => void
  onMouseMove: (event: React.MouseEvent) => void
  onMouseUp: () => void
}

export function useCompassPC(): UseCompassPCReturn {
  const [heading, setHeading] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const dragStateRef = useRef<{
    startX: number
    startHeading: number
  } | null>(null)

  const onMouseDown = useCallback((event: React.MouseEvent): void => {
    setIsDragging(true)
    dragStateRef.current = {
      startX: event.clientX,
      startHeading: heading,
    }
  }, [heading])

  const onMouseMove = useCallback((event: React.MouseEvent): void => {
    if (!isDragging || dragStateRef.current === null) return

    const deltaX = event.clientX - dragStateRef.current.startX
    const sensitivity = 0.5
    const newHeading = dragStateRef.current.startHeading + deltaX * sensitivity
    const normalized = ((newHeading % 360) + 360) % 360
    setHeading(normalized)
  }, [isDragging])

  const onMouseUp = useCallback((): void => {
    setIsDragging(false)
    dragStateRef.current = null
  }, [])

  const directionName = getDirectionName(heading)

  return {
    heading,
    directionName,
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }
}
