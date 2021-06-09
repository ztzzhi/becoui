import Launcher from '@xhs/launcher'
import antiSpamPlugin from '@xhs/launcher-plugin-anti-spam'

import { LauncherPluginLoading } from '@xhs/yam-beer'
import httpConfig from './config/http.config'
import routesConfig from './config/routes.config'

// @ts-ignore
require('./mock/index.js')

const app = new Launcher('#app', {
  routes: routesConfig,
  http: httpConfig,
})
app.use(antiSpamPlugin)
app.use(LauncherPluginLoading)

app.start()

export default app
