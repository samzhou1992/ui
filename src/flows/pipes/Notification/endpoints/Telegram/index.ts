import {TEST_NOTIFICATION} from 'src/flows/pipes/Notification/endpoints'
import View from './view'
import ReadOnly from './readOnly'

export default register => {
  register({
    type: 'telegram',
    name: 'Telegram',
    data: {
      url: 'https://api.telegram.org/bot',
      channel: '',
      token: '',
      parseMode: 'MarkdownV2',
    },
    featureFlag: 'notebooksNewEndpoints',
    component: View,
    readOnlyComponent: ReadOnly,
    generateImports: () =>
      ['contrib/sranka/telegram', 'influxdata/influxdb/secrets']
        .map(i => `import "${i}"`)
        .join('\n'),
    generateTestImports: () =>
      ['array', 'contrib/sranka/telegram', 'influxdata/influxdb/secrets']
        .map(i => `import "${i}"`)
        .join('\n'),
    generateQuery: data => `task_data
	|> schema["fieldsAsCols"]()
      |> set(key: "_notebook_link", value: "${window.location.href}")
	|> monitor["check"](
		data: check,
		messageFn: messageFn,
		crit: trigger,
	)
	|> monitor["notify"](
    data: notification,
    endpoint: telegram["endpoint"](
      url: "${data.url}",
      token: secrets.get(key: "${data.token}"),
      parseMode: "${data.parseMode}"
      )(
        mapFn: (r) => ({
          channel: "${data.channel}",
          text: "\${ r._message }"
    }))
  )`,
    generateTestQuery: data => `
    telegram.endpoint(
      url: "${data.url}",
      token: secrets.get(key: "${data.token}"),
      parseMode: "${data.parseMode}",
      channel: "${data.channel}",
      text: "${TEST_NOTIFICATION}"
    )

    array.from(rows: [{value: 0}])
        |> yield(name: "ignore")`,
  })
}
