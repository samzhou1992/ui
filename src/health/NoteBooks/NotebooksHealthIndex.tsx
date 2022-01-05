import {pageTitleSuffixer} from '../../shared/utils/pageTitles'
import {Page} from '@influxdata/clockface'
import React from 'react'
import {useSelector} from 'react-redux'
import {getOrg} from '../../organizations/selectors'
import HealthTabbedPage from '../HealthTabbedPage'
import NotebooksHealthTab from './NotebooksHealthTab'

const NotebooksHealthIndex = () => {
  const org = useSelector(getOrg)

  return (
    <Page titleTag={pageTitleSuffixer(['Dashboards Health'])}>
      <Page.Header fullWidth={true} testID="health-check-page--header">
        <Page.Title title="Dependency checks" />
      </Page.Header>
      <HealthTabbedPage activeTab="notebooks" orgID={org.id}>
        <NotebooksHealthTab />
      </HealthTabbedPage>
    </Page>
  )
}

export default NotebooksHealthIndex
