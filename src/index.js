import React from 'react'
import ReactDOM from 'react-dom'

export function createTeleporter() {
  const context = {}

  function setElement(element) {
    if (context.setElement) {
      context.setElement(element)
    } else {
      context.element = element
    }
  }

  function useTargetRef() {
    return React.useCallback(element => {
      setElement(element)
    }, [])
  }

  function Target({ as: As = 'div' }) {
    const handleRef = useTargetRef()
    return <As ref={handleRef} />
  }

  function Source({ children }) {
    const [element, setElement] = React.useState(null)
    React.useLayoutEffect(() => {
      context.setElement = setElement
      setElement(context.element)

      return () => {
        context.setElement = null
      }
    }, [])
    if (!element) return null
    return ReactDOM.createPortal(children, element)
  }

  return { Source, Target, useTargetRef }
}
