import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import { StatusBadge } from './components/StatusBadge'
import { Decision } from './components/Decision'

const themeComponents = getThemeComponents()

export function useMDXComponents(components?: Record<string, React.ComponentType<unknown>>) {
  return {
    ...themeComponents,
    StatusBadge,
    Decision,
    ...components
  }
}
