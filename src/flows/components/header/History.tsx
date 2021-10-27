// Libraries
import React, {FC, useRef, useState} from 'react'
import {
  Bullet,
  Button,
  IconFont,
  ComponentStatus,
  Popover,
  PopoverInteraction,
} from '@influxdata/clockface'

import './history.scss'

interface SaveProps {
  timestamp: Date
  username: string
  active?: boolean
}

const SaveState: FC<SaveProps> = ({timestamp, username, active}) => {
  const btnRef = useRef<HTMLDivElement>(null)
  const setActive = () => {
    btnRef.current && btnRef.current.classList.add('active')
  }

  const setInactive = () => {
    btnRef.current && btnRef.current.classList.remove('active')
  }

  const contents = (
    <div>
      updated by <span>{username}</span> at{' '}
      <span>{new Date(timestamp).toLocaleString()}</span>
    </div>
  )

  const classer = [
    ['history-state', true],
    ['highlight', active],
  ]
    .filter(c => !!c[1])
    .map(c => c[0])
    .join(' ')

  return (
    <div className={classer}>
      <Bullet glyph={IconFont.Checkmark} ref={btnRef} />
      <Popover
        distanceFromTrigger={8}
        triggerRef={btnRef}
        showEvent={PopoverInteraction.Hover}
        hideEvent={PopoverInteraction.Hover}
        onShow={setActive}
        onHide={setInactive}
        contents={() => contents}
      />
    </div>
  )
}

const PendingState: FC = () => {
  const btnRef = useRef<HTMLDivElement>(null)
  const active = () => {
    btnRef.current && btnRef.current.classList.add('active')
  }

  const inactive = () => {
    btnRef.current && btnRef.current.classList.remove('active')
  }

  const contents = <div>this notebook has unpublished changes</div>

  return (
    <div className="pending-state highlight">
      <Bullet glyph={IconFont.More} ref={btnRef} />
      <Popover
        distanceFromTrigger={8}
        triggerRef={btnRef}
        showEvent={PopoverInteraction.Hover}
        hideEvent={PopoverInteraction.Hover}
        onShow={active}
        onHide={inactive}
        contents={() => contents}
      />
    </div>
  )
}
const EXAMPLE_HISTORY = Array(8)
  .fill(null)
  .map(() => ({timestamp: new Date(), username: 'test user'}))
const History: FC = () => {
  const [history, setHistory] = useState(EXAMPLE_HISTORY)
  const [hasChanges, setHasChanges] = useState(true)

  const addChanges = () => {
    setHistory([...history, {username: 'me', timestamp: new Date()}])
    setHasChanges(false)
  }

  const states = history.map((h, idx) => {
    if (idx === history.length - 1 && !hasChanges) {
      return <SaveState {...h} active />
    }
    return <SaveState {...h} />
  })

  return (
    <>
      <div className="history">
        {states}
        {hasChanges && <PendingState />}
      </div>
      <Button
        text="Publish Changes"
        onClick={addChanges}
        status={hasChanges ? ComponentStatus.Default : ComponentStatus.Disabled}
      />
    </>
  )
}

export default History
