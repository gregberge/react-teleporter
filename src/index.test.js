import React from 'react'
import { render, cleanup } from '@testing-library/react'
import 'jest-dom/extend-expect'
import { createTeleporter } from './index'

afterEach(cleanup)

describe('teleporter', () => {
  it('teleports any children into target', () => {
    const Teleporter = createTeleporter()

    const { getByTestId } = render(
      <div>
        <div data-testid="target">
          <Teleporter.Target />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>,
    )

    expect(getByTestId('target')).toHaveTextContent('Hello')
  })

  it('teleports context', () => {
    const Teleporter = createTeleporter()
    const SimpleContext = React.createContext()
    function SimpleContextDump() {
      return React.useContext(SimpleContext)
    }

    const { getByTestId } = render(
      <div>
        <div data-testid="target">
          <Teleporter.Target />
        </div>
        <SimpleContext.Provider value="Hello">
          <div>
            <Teleporter.Source>
              <SimpleContextDump />
            </Teleporter.Source>
          </div>
        </SimpleContext.Provider>
      </div>,
    )

    expect(getByTestId('target')).toHaveTextContent('Hello')
  })

  it('supports "as" on target', () => {
    const Teleporter = createTeleporter()

    const { getByTestId } = render(
      <div>
        <div data-testid="target">
          <Teleporter.Target as="header" />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>,
    )

    expect(getByTestId('target')).toHaveTextContent('Hello')
    expect(getByTestId('target').firstChild.tagName).toBe('HEADER')
  })

  it('expose "useTargetRef"', () => {
    const Teleporter = createTeleporter()

    function CustomTarget() {
      const ref = Teleporter.useTargetRef()
      return <section ref={ref} />
    }

    const { getByTestId } = render(
      <div>
        <div data-testid="target">
          <CustomTarget />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>,
    )

    expect(getByTestId('target')).toHaveTextContent('Hello')
    expect(getByTestId('target').firstChild.tagName).toBe('SECTION')
  })
})
