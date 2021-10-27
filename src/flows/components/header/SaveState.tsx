import React, {FC, useContext} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {
  Button,
  ButtonType,
  ComponentColor,
  ComponentStatus,
} from '@influxdata/clockface'

import {getOrg} from 'src/organizations/selectors'
import {FlowContext} from 'src/flows/context/flow.current'
import {FlowListContext} from 'src/flows/context/flow.list'
import {isFlagEnabled} from 'src/shared/utils/featureFlag'
import {event} from 'src/cloud/utils/reporting'

const SaveState: FC = () => {
  const {flow} = useContext(FlowContext)
  const {add} = useContext(FlowListContext)
  const org = useSelector(getOrg)
  const history = useHistory()
  const addFlow = () => {
    event('Notebook save button clicked')
    add(flow).then(id => {
      history.replace(`/orgs/${org.id}/notebooks/${id}`)
    })
  }

  if (!isFlagEnabled('ephemeralNotebook')) {
    return null
  }

  if (!flow.id) {
    return (
      <Button
        text="Publish Notebook"
        color={ComponentColor.Success}
        type={ButtonType.Submit}
        onClick={addFlow}
        status={ComponentStatus.Default}
        testID="notebook-Publish"
        titleText="Publish Notebook"
      />
    )
  }

  if (flow.name.toLowerCase().includes('draft')) {
    return (
      <Button
        text="Publish Notebook"
        color={ComponentColor.Success}
        type={ButtonType.Submit}
        onClick={() => console.log('publish')}
        status={ComponentStatus.Default}
        testID="notebook-Publish"
        titleText="Publish Notebook"
      />
    )
  }

  return null
  // return <div className="flow-header--saving">Autosaved</div>
}

export default SaveState
