import MessageBox from './src/main.js'
/* istanbul ignore next */
MessageBox.install = function(Vue) {
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
}

export default MessageBox
