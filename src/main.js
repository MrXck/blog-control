import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createDiscreteApi} from 'naive-ui'

const {message, dialog, notification, loadingBar} = createDiscreteApi([
    'message',
    'dialog',
    'notification',
    'loadingBar'
]);
export {message, dialog, notification, loadingBar};
createApp(App).use(router).mount('#app')
