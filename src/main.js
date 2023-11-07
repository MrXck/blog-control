import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const {message, dialog, notification, loadingBar} = createDiscreteApi([
    'message',
    'dialog',
    'notification',
    'loadingBar'
]);
export {message, dialog, notification, loadingBar};
createApp(App).use(router).mount('#app')
