import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'
import { http } from '@/utils/http.js'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    state:{
        userInfo:{},
    },
    mutations: {
        setUserInfo(state,userInfo){
            state.userInfo = userInfo
        },
        cleanUserInfo(state) {
            state.userInfo = {}
        },
    },
    actions: {
        async userInfoAction({ commit, },showLoading = true){
            try {
                showLoading && uni.showLoading({
                    title: '正在登录',
                    mask: true
                })
                let res = await http({
                    url: '/api/user/info'
                })
                commit('setUserInfo', res)
            } catch (e) {
                // uni.navigateTo({ url: '/pages/login/login' })
                console.error(e)
            }
            uni.hideLoading()
        }
    },
    getters: {
        isVip(state) {
            return Boolean(
                state.userInfo.id && state.userInfo.end_time > dayjs().unix()
            ) 
        },
        isLogin(state) {
            return Boolean( state.userInfo.id )
        },
    }
})
export default store