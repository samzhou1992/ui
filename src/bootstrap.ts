// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
// A dependency graph that contains any wasm must all be imported
import ReactDOM from 'react-dom'
// asynchronously. This `bootstrap.ts` file does the single async import, so
// that no one else needs to worry about it again.
import('./index').catch(e => console.error('Error importing `index.tsx`:', e))

// export async function bootstrap() {
//   console.log('react app bootstraped');
// }

export async function mount(props) {
  // console.log('mount: props from main framework', props);
  const indexModule = await import('./index')
  indexModule.render(props)
}

export async function unmount(props) {
  const { container } = props;
  // console.log('unmount: props from main framework', props);
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#influx-root') : document.querySelector('#influx-root'));
}