import React from 'react'
import ReactDOM from 'react-dom'

export function createTeleporter() {
  const context = {}

  function setElement(element) {
    context.value = element
    if (context.set) {
      context.set(element)
    }
  }

  function useTargetRef() {
    return React.useCallback(element => {
      setElement(element)
    }, [])
  }

  function Target({ as: As = 'div', ...props }) {
    const handleRef = useTargetRef()
    return <As ref={handleRef} {...props} />
  }

  function Source({ children }) {
    const [element, setElement] = React.useState(null)
    React.useLayoutEffect(() => {
      if (context.set) {
        context.set(null)
      }
      
      context.set = setElement
      setElement(context.value)

      return () => {
        context.set = null
      }
    }, [])
    if (!element) return null
    return ReactDOM.createPortal(children, element)
  }

  return { Source, Target, useTargetRef }
}
