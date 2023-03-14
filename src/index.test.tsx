/* eslint-env jest */

import * as React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import { render as reactRender, cleanup } from "@testing-library/react";
import { createTeleporter, Teleporter as TypeTeleporter } from "./index";

// Setup function, see https://testing-library.com/docs/user-event/intro
const render = (jsx: React.ReactElement) => {
  return {
    user: userEvent.setup(),
    ...reactRender(jsx),
  };
};

afterEach(cleanup);

describe("teleporter", () => {
  it("teleports any children into target", () => {
    const Teleporter = createTeleporter();

    render(
      <div>
        <div data-testid="target">
          <Teleporter.Target />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>
    );

    expect(screen.getByTestId("target")).toHaveTextContent("Hello");
  });

  it("teleports context", () => {
    const Teleporter = createTeleporter();
    const SimpleContext = React.createContext<string>("");
    const SimpleContextDump: React.FC = () => {
      return <>{React.useContext(SimpleContext)}</>;
    };

    render(
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
      </div>
    );

    expect(screen.getByTestId("target")).toHaveTextContent("Hello");
  });

  it('supports "as" on target', () => {
    const Teleporter = createTeleporter();

    const { getByTestId } = render(
      <div>
        <div data-testid="target">
          <Teleporter.Target as="header" />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>
    );

    expect(getByTestId("target")).toHaveTextContent("Hello");
    // @ts-ignore
    expect(getByTestId("target").firstChild.tagName).toBe("HEADER");
  });

  it("supports function as children on source", () => {
    const Teleporter = createTeleporter();
    const sourceContent = (target: Element): React.ReactNode => (
      <p>Hello from {target.id}!</p>
    );

    render(
      <div>
        <Teleporter.Target as="header" id="Target Element" />
        <div>
          <Teleporter.Source>{sourceContent}</Teleporter.Source>
        </div>
      </div>
    );

    expect(screen.getByRole("banner")).toHaveTextContent(
      "Hello from Target Element!"
    );
  });

  it("forwards props to Target", async () => {
    const Teleporter = createTeleporter();
    const clickSpy = jest.fn();

    const { user } = render(
      <div>
        <div data-testid="target">
          <Teleporter.Target as="header" onClick={clickSpy} />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>
    );

    const targetContainer = screen.getByTestId("target");
    expect(targetContainer).toHaveTextContent("Hello");
    // @ts-ignore
    await user.click(targetContainer.firstChild);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('expose "useTargetRef"', () => {
    const Teleporter = createTeleporter();

    function CustomTarget() {
      const ref = Teleporter.useTargetRef();
      return <section ref={ref} />;
    }

    render(
      <div>
        <div data-testid="target">
          <CustomTarget />
        </div>
        <div>
          <Teleporter.Source>Hello</Teleporter.Source>
        </div>
      </div>
    );

    expect(screen.getByTestId("target")).toHaveTextContent("Hello");
    // @ts-ignore
    expect(screen.getByTestId("target").firstChild.tagName).toBe("SECTION");
  });

  describe("mount order", () => {
    let Teleporter: TypeTeleporter;
    let App: React.FC<{ hasTarget: boolean; hasSource: boolean }>;
    beforeEach(() => {
      Teleporter = createTeleporter();
      App = ({ hasTarget, hasSource }) => {
        return (
          <div>
            <div data-testid="target">{hasTarget && <Teleporter.Target />}</div>
            <div>
              {hasSource && <Teleporter.Source>Hello</Teleporter.Source>}
            </div>
          </div>
        );
      };
    });

    it("supports target late mount", () => {
      const { rerender } = render(<App hasSource hasTarget={false} />);
      const targetContainer = screen.getByTestId("target");
      expect(targetContainer).not.toHaveTextContent("Hello");
      rerender(<App hasSource hasTarget />);
      expect(targetContainer).toHaveTextContent("Hello");
    });

    it("supports target unmount", () => {
      const { rerender } = render(<App hasSource hasTarget />);
      const targetContainer = screen.getByTestId("target");
      expect(targetContainer).toHaveTextContent("Hello");
      rerender(<App hasSource hasTarget={false} />);
      expect(targetContainer).not.toHaveTextContent("Hello");
    });

    it("supports source late mount", () => {
      const { rerender } = render(<App hasSource={false} hasTarget />);
      const targetContainer = screen.getByTestId("target");
      expect(targetContainer).not.toHaveTextContent("Hello");
      rerender(<App hasSource hasTarget />);
      expect(targetContainer).toHaveTextContent("Hello");
    });

    it("supports source unmount", () => {
      const { rerender } = render(<App hasSource hasTarget />);
      const targetContainer = screen.getByTestId("target");
      expect(targetContainer).toHaveTextContent("Hello");
      rerender(<App hasSource={false} hasTarget />);
      expect(targetContainer).not.toHaveTextContent("Hello");
    });

    it("supports source swapping", async () => {
      function App() {
        const [source, setSource] = React.useState("A");
        return (
          <div>
            <div data-testid="target">
              <Teleporter.Target />
            </div>
            <button type="button" onClick={() => setSource("A")}>
              Use A
            </button>
            <button type="button" onClick={() => setSource("B")}>
              Use B
            </button>
            <div>
              {source === "A" && (
                <Teleporter.Source>Source A</Teleporter.Source>
              )}
              {source === "B" && (
                <Teleporter.Source>Source B</Teleporter.Source>
              )}
            </div>
          </div>
        );
      }
      const { user } = render(<App />);
      const targetContainer = screen.getByTestId("target");
      const useABtn = screen.getByText("Use A");
      const useBBtn = screen.getByText("Use B");
      expect(targetContainer).toHaveTextContent("Source A");
      await user.click(useBBtn);
      expect(targetContainer).toHaveTextContent("Source B");
      await user.click(useABtn);
      expect(targetContainer).toHaveTextContent("Source A");
    });
  });

  describe("multiple sources / targets", () => {
    it("takes only the latest defined source", () => {
      const Teleporter = createTeleporter();

      render(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
            <Teleporter.Source>B</Teleporter.Source>
          </div>
        </div>
      );

      expect(screen.getByTestId("target")).toHaveTextContent("B");
    });

    it("takes uses the latest source if the new one is unmounted", () => {
      const Teleporter = createTeleporter();

      const { rerender } = render(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
            <Teleporter.Source>B</Teleporter.Source>
          </div>
        </div>
      );

      expect(screen.getByTestId("target")).toHaveTextContent("B");

      rerender(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
          </div>
        </div>
      );

      expect(screen.getByTestId("target")).toHaveTextContent("A");
    });

    it("allows multiple sources using `multiSources` option", () => {
      const Teleporter = createTeleporter({ multiSources: true });

      render(
        <div>
          <div data-testid="target">
            <Teleporter.Target />
          </div>
          <div>
            <Teleporter.Source>A</Teleporter.Source>
            <Teleporter.Source>B</Teleporter.Source>
          </div>
        </div>
      );

      expect(screen.getByTestId("target")).toHaveTextContent("AB");
    });

    it("handles uses the latest target defined", () => {
      const Teleporter = createTeleporter();

      render(
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
        </div>
      );

      expect(screen.getByTestId("targetA")).not.toHaveTextContent("A");
      expect(screen.getByTestId("targetB")).toHaveTextContent("A");
    });
  });
});
