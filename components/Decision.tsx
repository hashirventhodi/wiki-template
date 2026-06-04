import type { CSSProperties, ReactElement, ReactNode } from 'react'

type DecisionStatus = 'proposed' | 'accepted' | 'superseded' | 'deprecated'

const statusColor: Record<DecisionStatus, string> = {
  proposed: '#854d0e',
  accepted: '#166534',
  superseded: '#6b7280',
  deprecated: '#991b1b'
}

export function Decision({
  id,
  date,
  status,
  supersedes,
  children
}: {
  id: string
  date: string
  status: DecisionStatus
  supersedes?: string
  children?: ReactNode
}): ReactElement {
  const wrapperStyle: CSSProperties = {
    border: '1px solid var(--nextra-border, #e5e7eb)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginTop: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'var(--nextra-bg-soft, transparent)'
  }
  const rowStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
    alignItems: 'baseline'
  }
  const labelStyle: CSSProperties = { color: '#6b7280', marginRight: '0.4rem' }
  const statusStyle: CSSProperties = {
    color: statusColor[status],
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  }
  return (
    <div style={wrapperStyle}>
      <div style={rowStyle}>
        <span>
          <span style={labelStyle}>ADR</span>
          <strong>{id}</strong>
        </span>
        <span>
          <span style={labelStyle}>Date</span>
          {date}
        </span>
        <span>
          <span style={labelStyle}>Status</span>
          <span style={statusStyle}>{status}</span>
        </span>
        {supersedes && (
          <span>
            <span style={labelStyle}>Supersedes</span>
            {supersedes}
          </span>
        )}
      </div>
      {children && <div style={{ marginTop: '0.5rem' }}>{children}</div>}
    </div>
  )
}
