import React from 'react'
import ReactDOM from 'react-dom'

export function createTeleporter({ multiSources } = {}) {
  const context = {}

  function setElement(element) {
    context.value = element
    if (context.set && context.set.current) {
      context.set.current(element)
    }
  }

  function useTargetRef() {
    return setElement
  }

  function Target({ as: As = 'div', ...props }) {
    return <As ref={setElement} {...props} />
  }

  function Source({ children }) {
    const [element, setElement] = React.useState(null)
    React.useLayoutEffect(() => {
      const setRef = { current: setElement }
      let previousSet

      if (context.set) {
        previousSet = context.set
        if (!multiSources) {
          context.set.current(null)
        }
      }

      context.set = setRef
      setElement(context.value)

      return () => {
        setRef.current = null
        context.set = null

        if (previousSet && previousSet.current) {
          context.set = previousSet
          context.set.current(context.value)
        }
      }
    }, [])
    if (!element) return null
    return ReactDOM.createPortal(children, element)
  }

  return { Source, Target, useTargetRef }
}
