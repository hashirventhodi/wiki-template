import type { CSSProperties, ReactElement } from 'react'

export type Status = 'stable' | 'draft' | 'stub' | 'deprecated'

const palette: Record<Status, { bg: string; fg: string; label: string }> = {
  stable: { bg: '#dcfce7', fg: '#166534', label: 'stable' },
  draft: { bg: '#fef3c7', fg: '#854d0e', label: 'draft' },
  stub: { bg: '#e5e7eb', fg: '#374151', label: 'stub' },
  deprecated: { bg: '#fee2e2', fg: '#991b1b', label: 'deprecated' }
}

export function StatusBadge({ status }: { status: Status }): ReactElement {
  const { bg, fg, label } = palette[status] ?? palette.stub
  const style: CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: bg,
    color: fg,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    verticalAlign: 'middle',
    marginLeft: '0.5rem'
  }
  return <span style={style}>{label}</span>
}
