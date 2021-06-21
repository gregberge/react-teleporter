/* eslint-disable react/display-name */
/* eslint-env jest */

import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
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

  it('forwards props to Target', () => {
    const Teleporter = createTeleporter()
    const clickSpy = jest.fn()

    const { getByTestId } = render(
      <div>
        <div data-testid="target">
          <Teleporter.Target as="header" onClick={clickSpy} />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>,
    )

    const targetContainer = getByTestId('target')
    expect(targetContainer).toHaveTextContent('Hello')
    fireEvent.click(targetContainer.firstChild)
    expect(clickSpy).toHaveBeenCalled()
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

  describe('mount order', () => {
    let Teleporter
    let App
    beforeEach(() => {
      Teleporter = createTeleporter()
      App = ({ hasTarget, hasSource }) => {
        return (
          <div>
            <div data-testid="target">{hasTarget && <Teleporter.Target />}</div>
            <div>
              {hasSource && <Teleporter.Source>Hello</Teleporter.Source>}
            </div>
          </div>
        )
      }
    })

    it('supports target late mount', () => {
      const { getByTestId, rerender } = render(
        <App hasSource hasTarget={false} />,
      )
      const targetContainer = getByTestId('target')
      expect(targetContainer).not.toHaveTextContent('Hello')
      rerender(<App hasSource hasTarget />)
      expect(targetContainer).toHaveTextContent('Hello')
    })

    it('supports target unmount', () => {
      const { getByTestId, rerender } = render(<App hasSource hasTarget />)
      const targetContainer = getByTestId('target')
      expect(targetContainer).toHaveTextContent('Hello')
      rerender(<App hasSource hasTarget={false} />)
      expect(targetContainer).not.toHaveTextContent('Hello')
    })

    it('supports source late mount', () => {
      const { getByTestId, rerender } = render(
        <App hasSource={false} hasTarget />,
      )
      const targetContainer = getByTestId('target')
      expect(targetContainer).not.toHaveTextContent('Hello')
      rerender(<App hasSource hasTarget />)
      expect(targetContainer).toHaveTextContent('Hello')
    })

    it('supports source unmount', () => {
      const { getByTestId, rerender } = render(<App hasSource hasTarget />)
      const targetContainer = getByTestId('target')
      expect(targetContainer).toHaveTextContent('Hello')
      rerender(<App hasSource={false} hasTarget />)
      expect(targetContainer).not.toHaveTextContent('Hello')
    })

    it('supports source swapping', () => {
      function App() {
        const [source, setSource] = React.useState('A')
        return (
          <div>
            <div data-testid="target">
              <Teleporter.Target />
            </div>
            <button type="button" onClick={() => setSource('A')}>
              Use A
            </button>
            <button type="button" onClick={() => setSource('B')}>
              Use B
            </button>
            <div>
              {source === 'A' && (
                <Teleporter.Source>Source A</Teleporter.Source>
              )}
              {source === 'B' && (
                <Teleporter.Source>Source B</Teleporter.Source>
              )}
            </div>
          </div>
        )
      }
      const { getByTestId, getByText } = render(<App hasSource hasTarget />)
      const targetContainer = getByTestId('target')
      const useABtn = getByText('Use A')
      const useBBtn = getByText('Use B')
      expect(targetContainer).toHaveTextContent('Source A')
      fireEvent.click(useBBtn)
      expect(targetContainer).toHaveTextContent('Source B')
      fireEvent.click(useABtn)
      expect(targetContainer).toHaveTextContent('Source A')
    })
  })

  describe('multiple sources / targets', () => {
    it('takes only the latest defined source', () => {
      const Teleporter = createTeleporter()

      const { getByTestId } = render(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
            <Teleporter.Source>B</Teleporter.Source>
          </div>
        </div>,
      )

      expect(getByTestId('target')).toHaveTextContent('B')
    })

    it('takes uses the latest source if the new one is unmounted', () => {
      const Teleporter = createTeleporter()

      const { getByTestId, rerender } = render(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
            <Teleporter.Source>B</Teleporter.Source>
          </div>
        </div>,
      )

      expect(getByTestId('target')).toHaveTextContent('B')

      rerender(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
          </div>
        </div>,
      )

      expect(getByTestId('target')).toHaveTextContent('A')
    })

    it('allows multiple sources using `multiSources` option', () => {
      const Teleporter = createTeleporter({ multiSources: true })

      const { getByTestId } = render(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
            <Teleporter.Source>B</Teleporter.Source>
          </div>
        </div>,
      )

      expect(getByTestId('target')).toHaveTextContent('AB')
    })

    it('handles uses the latest target defined', () => {
      const Teleporter = createTeleporter()

      const { getByTestId } = render(
        <div>
          <div data-testid="targetA">
            <Teleporter.Target />
          </div>
          <div data-testid="targetB">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
          </div>
        </div>,
      )

      expect(getByTestId('targetA')).not.toHaveTextContent('A')
      expect(getByTestId('targetB')).toHaveTextContent('A')
    })
  })
})
