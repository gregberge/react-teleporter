import * as React from "react";
import * as ReactDOM from "react-dom";

// Internal types
type As<Props = any> = React.ElementType<Props>;
type PropsWithAs<Props = {}, Type extends As = As> = Props &
  Omit<React.ComponentProps<Type>, "as" | keyof Props> & {
    as?: Type;
  };

type ComponentWithAs<Props, DefaultType extends As> = {
  <Type extends As>(
    props: PropsWithAs<Props, Type> & { as: Type }
  ): JSX.Element;
  (props: PropsWithAs<Props, DefaultType>): JSX.Element;
};

type TargetRefRef = { current: TargetRef | null };

interface Context {
  element: Element | null;
  set: TargetRefRef | null;
}

export interface CreateTeleporterOptions {
  multiSources?: Boolean;
}

export interface TargetRef {
  (element: Element | null): void;
}

export interface Teleporter {
  Source: React.FC<{ children: React.ReactNode }>;
  Target: ComponentWithAs<{}, "div">;
  useTargetRef: () => TargetRef;
}

export const createTeleporter = ({
  multiSources,
}: CreateTeleporterOptions = {}): Teleporter => {
  const context: Context = { element: null, set: null };

  const setElement: TargetRef = (element) => {
    context.element = element;
    if (context.set && context.set.current) {
      context.set.current(element);
    }
  };

  const useTargetRef = () => setElement;

  const SourceWrapper: React.FC<React.DOMAttributes<HTMLElement>> = ({
    children,
    ...props
  }) => {
    return (
      <div {...props} style={{ display: "contents" }}>
        {children}
      </div>
    );
  };

  const Target = ({ as: As = "div", ...props }: PropsWithAs<{}, "div">) => {
    return <As ref={setElement} {...props} />;
  };

  const Source = ({ children }: { children: React.ReactNode }) => {
    const [element, setElement] = React.useState<Element | null>(null);

    React.useLayoutEffect(() => {
      const setRef: TargetRefRef = { current: setElement };
      let previousSet: TargetRefRef;

      if (context.set) {
        previousSet = context.set;
        if (!multiSources && context.set.current) {
          context.set.current(null);
        }
      }

      context.set = setRef;
      if (context.element !== undefined) {
        setElement(context.element);
      }

      return () => {
        setRef.current = null;
        context.set = null;

        if (previousSet && previousSet.current) {
          context.set = previousSet;
          if (context.element !== undefined) {
            previousSet.current(context.element);
          }
        }
      };
    }, []);

    if (!element) return null;
    const handleClick = (e: React.SyntheticEvent) =>
      element.dispatchEvent(new Event(e.type, e));

    return ReactDOM.createPortal(
      <SourceWrapper onClick={handleClick}>{children}</SourceWrapper>,
      element
    );
  };

  return { Source, Target, useTargetRef };
};
