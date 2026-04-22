import { useCallback, useState } from "react"

type PermissionType = "camera" | "geolocation" | "orientation"

type PermissionStatus = "prompt" | "granted" | "denied" | "unsupported"

interface PermissionState {
  status: PermissionStatus
  error?: string
}

type PermissionsMap = {
  [K in PermissionType]?: PermissionState
}

interface UsePermissionReturn {
  permissions: PermissionsMap
  request: (type: PermissionType) => Promise<void>
}

export function usePermission(): UsePermissionReturn {
  const [permissions, setPermissions] = useState<PermissionsMap>({})

  const request = useCallback(async (type: PermissionType): Promise<void> => {
    const updatePermission = (
      permissionType: PermissionType,
      status: PermissionStatus,
      error?: string
    ): void => {
      setPermissions((prev) => ({
        ...prev,
        [permissionType]: { status, ...(error ? { error } : {}) },
      }))
    }

    if (type === "camera") {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          updatePermission("camera", "unsupported")
          return
        }
        await navigator.mediaDevices.getUserMedia({ video: true })
        updatePermission("camera", "granted")
      } catch (err) {
        const message = err instanceof Error ? err.message : "Camera permission denied"
        updatePermission(
          "camera",
          message.includes("Permission") || message.includes("denied") ? "denied" : "unsupported",
          message
        )
      }
      return
    }

    if (type === "geolocation") {
      if (!navigator.geolocation) {
        updatePermission("geolocation", "unsupported")
        return
      }
      navigator.geolocation.getCurrentPosition(
        () => {
          updatePermission("geolocation", "granted")
        },
        (err) => {
          const message = err.message ?? "Geolocation permission denied"
          updatePermission(
            "geolocation",
            err.code === 1 ? "denied" : "unsupported",
            message
          )
        },
        { timeout: 5000 }
      )
      return
    }

    if (type === "orientation") {
      const DeviceOrientation = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<"granted" | "denied">
          })
        | undefined

      if (!DeviceOrientation) {
        updatePermission("orientation", "unsupported")
        return
      }

      if (typeof DeviceOrientation.requestPermission === "function") {
        // iOS 13+ requires explicit permission request
        try {
          const result = await DeviceOrientation.requestPermission()
          updatePermission("orientation", result)
        } catch (err) {
          const message = err instanceof Error ? err.message : "Orientation permission request failed"
          updatePermission("orientation", "unsupported", message)
        }
      } else {
        // Android or non-iOS devices: deviceorientation is typically available without prompt
        if ("ondeviceorientation" in window) {
          updatePermission("orientation", "granted")
        } else {
          updatePermission("orientation", "unsupported")
        }
      }
    }
  }, [])

  return {
    permissions,
    request,
  }
}
