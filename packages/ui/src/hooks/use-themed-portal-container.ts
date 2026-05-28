import * as React from "react"

export function useThemedPortalContainer() {
  const [container, setContainer] = React.useState<HTMLElement | null>(() =>
    getThemedPortalContainer()
  )

  React.useEffect(() => {
    setContainer(getThemedPortalContainer())
  }, [])

  return container
}

function getThemedPortalContainer() {
  if (typeof document === "undefined") {
    return null
  }

  return (
    document.querySelector<HTMLElement>("[data-theme-preview]") ??
    document.body
  )
}
