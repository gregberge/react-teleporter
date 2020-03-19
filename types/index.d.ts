import * as React from 'react'

interface TargetComponentType {
  <C extends React.ElementType = 'div'>(
    props: { as?: C } & Omit<React.ComponentPropsWithoutRef<C>, 'as'>,
  ): JSX.Element
}

export interface TeleporterType {
  Source: React.ComponentType
  Target: TargetComponentType
  useTargetRef(): (element: Element | null) => void
}

export interface TeleporterOptions {
  multiSources?: boolean
}

export function createTeleporter(options?: TeleporterOptions): TeleporterType
