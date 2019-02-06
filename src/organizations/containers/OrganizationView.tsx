// Libraries
import React, {PureComponent} from 'react'
import {WithRouterProps} from 'react-router'
import {connect} from 'react-redux'
import _ from 'lodash'

// APIs
import {getDashboards} from 'src/organizations/apis'
import {client} from 'src/utils/api'

const getCollectors = async (org: Organization) => {
  return client.telegrafConfigs.getAllByOrg(org)
}

const getScrapers = async () => {
  return await client.scrapers.getAll()
}

const getBuckets = async (org: Organization) => {
  return client.buckets.getAllByOrg(org)
}

const getTasks = async (org: Organization) => {
  return client.tasks.getAllByOrg(org)
}

// Actions
import {updateOrg} from 'src/organizations/actions'
import * as notifyActions from 'src/shared/actions/notifications'

// Components
import {Page} from 'src/pageLayout'
import {SpinnerContainer, TechnoSpinner} from 'src/clockface'
import TabbedPage from 'src/shared/components/tabbed_page/TabbedPage'
import TabbedPageSection from 'src/shared/components/tabbed_page/TabbedPageSection'
import Members from 'src/organizations/components/Members'
import Buckets from 'src/organizations/components/Buckets'
import Dashboards from 'src/organizations/components/Dashboards'
import Tasks from 'src/organizations/components/Tasks'
import Collectors from 'src/organizations/components/Collectors'
import Scrapers from 'src/organizations/components/Scrapers'
import GetOrgResources from 'src/organizations/components/GetOrgResources'
import RenamablePageTitle from 'src/pageLayout/components/RenamablePageTitle'

// Types
import {AppState, Dashboard} from 'src/types/v2'
import {
  ResourceOwner,
  Bucket,
  Organization,
  Task,
  Telegraf,
  ScraperTargetResponse,
} from 'src/api'
import * as NotificationsActions from 'src/types/actions/notifications'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

interface StateProps {
  org: Organization
}

interface DispatchProps {
  onUpdateOrg: typeof updateOrg
  notify: NotificationsActions.PublishNotificationActionCreator
}

type Props = StateProps & WithRouterProps & DispatchProps

@ErrorHandling
class OrganizationView extends PureComponent<Props> {
  public render() {
    const {org, params, notify} = this.props

    return (
      <Page titleTag={org.name}>
        <Page.Header fullWidth={false}>
          <Page.Header.Left>
            <RenamablePageTitle
              name={org.name}
              maxLength={70}
              placeholder="Name this Organization"
              onRename={this.handleUpdateOrg}
            />
          </Page.Header.Left>
          <Page.Header.Right />
        </Page.Header>
        <Page.Contents fullWidth={false} scrollable={true}>
          <div className="col-xs-12">
            <TabbedPage
              name={org.name}
              parentUrl={`/organizations/${org.id}`}
              activeTabUrl={params.tab}
            >
              <TabbedPageSection
                id="org-view-tab--members"
                url="members_tab"
                title="Members"
              >
                <GetOrgResources<ResourceOwner[]>
                  organization={org}
                  fetcher={this.getOwnersAndMembers}
                >
                  {(members, loading) => (
                    <SpinnerContainer
                      loading={loading}
                      spinnerComponent={<TechnoSpinner />}
                    >
                      <Members members={members} orgName={org.name} />
                    </SpinnerContainer>
                  )}
                </GetOrgResources>
              </TabbedPageSection>
              <TabbedPageSection
                id="org-view-tab--buckets"
                url="buckets_tab"
                title="Buckets"
              >
                <GetOrgResources<Bucket[]>
                  organization={org}
                  fetcher={getBuckets}
                >
                  {(buckets, loading, fetch) => (
                    <SpinnerContainer
                      loading={loading}
                      spinnerComponent={<TechnoSpinner />}
                    >
                      <Buckets
                        buckets={buckets}
                        org={org}
                        onChange={fetch}
                        notify={notify}
                      />
                    </SpinnerContainer>
                  )}
                </GetOrgResources>
              </TabbedPageSection>
              <TabbedPageSection
                id="org-view-tab--dashboards"
                url="dashboards_tab"
                title="Dashboards"
              >
                <GetOrgResources<Dashboard[]>
                  organization={org}
                  fetcher={getDashboards}
                >
                  {(dashboards, loading, fetch) => (
                    <SpinnerContainer
                      loading={loading}
                      spinnerComponent={<TechnoSpinner />}
                    >
                      <Dashboards
                        dashboards={dashboards}
                        orgName={org.name}
                        onChange={fetch}
                        orgID={org.id}
                      />
                    </SpinnerContainer>
                  )}
                </GetOrgResources>
              </TabbedPageSection>
              <TabbedPageSection
                id="org-view-tab--tasks"
                url="tasks_tab"
                title="Tasks"
              >
                <GetOrgResources<Task[]> organization={org} fetcher={getTasks}>
                  {(tasks, loading, fetch) => (
                    <SpinnerContainer
                      loading={loading}
                      spinnerComponent={<TechnoSpinner />}
                    >
                      <Tasks
                        tasks={tasks}
                        orgName={org.name}
                        onChange={fetch}
                      />
                    </SpinnerContainer>
                  )}
                </GetOrgResources>
              </TabbedPageSection>
              <TabbedPageSection
                id="org-view-tab--collectors"
                url="collectors_tab"
                title="Telegraf"
              >
                <GetOrgResources<Telegraf[]>
                  organization={org}
                  fetcher={getCollectors}
                >
                  {(collectors, loading, fetch) => (
                    <SpinnerContainer
                      loading={loading}
                      spinnerComponent={<TechnoSpinner />}
                    >
                      <GetOrgResources<Bucket[]>
                        organization={org}
                        fetcher={getBuckets}
                      >
                        {(buckets, loading) => (
                          <SpinnerContainer
                            loading={loading}
                            spinnerComponent={<TechnoSpinner />}
                          >
                            <Collectors
                              collectors={collectors}
                              onChange={fetch}
                              notify={notify}
                              buckets={buckets}
                              orgName={org.name}
                            />
                          </SpinnerContainer>
                        )}
                      </GetOrgResources>
                    </SpinnerContainer>
                  )}
                </GetOrgResources>
              </TabbedPageSection>
              <TabbedPageSection
                id="org-view-tab--scrapers"
                url="scrapers_tab"
                title="Scrapers"
              >
                <GetOrgResources<ScraperTargetResponse[]>
                  organization={org}
                  fetcher={getScrapers}
                >
                  {(scrapers, loading, fetch) => {
                    return (
                      <SpinnerContainer
                        loading={loading}
                        spinnerComponent={<TechnoSpinner />}
                      >
                        <GetOrgResources<Bucket[]>
                          organization={org}
                          fetcher={getBuckets}
                        >
                          {(buckets, loading) => (
                            <SpinnerContainer
                              loading={loading}
                              spinnerComponent={<TechnoSpinner />}
                            >
                              <Scrapers
                                scrapers={scrapers}
                                onChange={fetch}
                                orgName={org.name}
                                buckets={buckets}
                              />
                            </SpinnerContainer>
                          )}
                        </GetOrgResources>
                      </SpinnerContainer>
                    )
                  }}
                </GetOrgResources>
              </TabbedPageSection>
            </TabbedPage>
          </div>
        </Page.Contents>
      </Page>
    )
  }

  private handleUpdateOrg = (name: string): void => {
    const {org, onUpdateOrg} = this.props

    const updatedOrg = {...org, name}

    onUpdateOrg(updatedOrg)
  }

  private getOwnersAndMembers = async (org: Organization) => {
    const allMembers = await Promise.all([
      client.organizations.owners(org.id),
      client.organizations.members(org.id),
    ])

    return [].concat(...allMembers)
  }
}

const mstp = (state: AppState, props: WithRouterProps) => {
  const {orgs} = state
  const org = orgs.find(o => o.id === props.params.orgID)
  return {
    org,
  }
}

const mdtp: DispatchProps = {
  onUpdateOrg: updateOrg,
  notify: notifyActions.notify,
}

export default connect<StateProps, DispatchProps, {}>(
  mstp,
  mdtp
)(OrganizationView)
