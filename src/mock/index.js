const context = require.context('./module', true, /\.js$/)

// // 过滤掉 index.js，只保留业务相关的 js
context.keys().filter(item => item !== './index.js').map(context)

export default context
