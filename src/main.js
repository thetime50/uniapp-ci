import Vue from 'vue'
import App from './App'
import dayjs from 'dayjs'
import {http} from './utils/http.js'
import store from './store'

/* 引入全局组件 */
import mIcon from '@/components/mIcon/mIcon.vue' //图标组件
import mHeader from '@/components/mHeader/mHeader.vue' //图标组件


/*注册全局组件*/
Vue.component('m-icon', mIcon);
Vue.component('m-header', mHeader);



Vue.config.productionTip = false
Vue.prototype.$day = dayjs;
Vue.prototype.$http = http;
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
