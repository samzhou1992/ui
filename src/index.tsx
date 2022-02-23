// @ts-ignore
if (window.__POWERED_BY_QIANKUN__) {
  // @ts-ignore
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
import 'babel-polyfill'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
// Libraries
import React, {Suspense, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Route} from 'react-router-dom'
import {ConnectedRouter} from 'connected-react-router'

// Stores
import {getStore} from 'src/store/configureStore'
import {history} from 'src/store/history'

// Components
import Setup from 'src/Setup'
import PageSpinner from 'src/perf/components/PageSpinner'

// Utilities
import {getRootNode} from 'src/utils/nodes'
import {
  updateReportingContext,
  updateCampaignInfo,
} from 'src/cloud/utils/reporting'
import {getBrowserBasepath} from 'src/utils/basepath'

// Constants
import {CLOUD} from 'src/shared/constants'

// Actions
import {disablePresentationMode} from 'src/shared/actions/app'

// Styles
import 'src/style/chronograf.scss'
import '@influxdata/clockface/dist/index.css'
import '@docsearch/css'
import 'src/style/global.scss'
const rootNode = getRootNode()

const SESSION_KEY = 'session'

const cookieSession = document.cookie.match(
  new RegExp('(^| )' + SESSION_KEY + '=([^;]+)')
)

updateReportingContext({
  session: cookieSession ? cookieSession[2].slice(5) : '',
})

if (CLOUD) {
  updateCampaignInfo(window.location.search)
}

const {dispatch} = getStore()

if (window['Cypress']) {
  window['store'] = getStore()
}

history.listen(() => {
  dispatch(disablePresentationMode())
})

declare global {
  interface Window {
    basepath: string
    dataLayer: any[]
  }
}

window.addEventListener('keyup', event => {
  const escapeKeyCode = 27
  // fallback for browsers that don't support event.key
  if (event.key === 'Escape' || event.keyCode === escapeKeyCode) {
    dispatch(disablePresentationMode())
  }
})

const Root: React.FC<{masterHistory?: any}> = ({masterHistory}) => {

  useEffect(() => {
    const basename = getBrowserBasepath()
    const unListen = masterHistory?.listen((location) => {
      if (location.pathname.startsWith('/data-analysis')) {
        history.replace(location.pathname.slice(basename.length))
      }
    });
    return () => unListen && unListen()
  },[])

  return (<Provider store={getStore()}>
    <ConnectedRouter history={history}>
      <Suspense fallback={<PageSpinner/>}>
        <Route component={Setup}/>
      </Suspense>
    </ConnectedRouter>
  </Provider>
  )
}

export function render(props) {
  const { container, masterHistory } = props;
  ReactDOM.render(<Root masterHistory={masterHistory}/>, container ? container.querySelector('#influx-root') : document.querySelector('#influx-root'));
}

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  ReactDOM.render(<Root />, rootNode)
}

