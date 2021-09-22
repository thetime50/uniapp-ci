import store from '../store'

const ENV_MOD = 'service' // service mini debug

if(![
    'service',
    'debug',
  ].includes(ENV_MOD)){
    throw new Error('ENV_MOD error')
}
const baseCfg = {
  service: {url:'https://xxx.com',encrypt:true}, // 生产服
  debug: {url:'https://yyy.com',encrypt:false}, // 测试服
} [ENV_MOD]

const noLoginApis=[ // 允许未登录访问的接口
  '/api/user/info',//获取用户信息
]

const noLoginApisRe = noLoginApis.map((v,i,a)=>{
  return RegExp(`^${v}\\b`, 'i')
})

// 如果在noLoginApis中 返回true
function noLoginApiTest(url){
  const include = noLoginApisRe.findIndex((v, i, a) => {
    return v.test(url)
  })
  return include >=0
}

export const http = function ({
  url,
  method='get',
  header = {'Content-Type': 'application/json','Authorization':'' && `Bearer ${''}`},
  data,
  showLoading = false,
  showNavLoading = true,
}){
  showNavLoading && uni.showNavigationBarLoading()
  showLoading && uni.showLoading({
    title: '',
    mask: false
  })
  return new Promise((resolve,reject)=>{

      // 未登录状态接口拦截
      if (!header.Authorization && !noLoginApiTest(url)) {
        // 拦截接口 就相当于401
        // removeToken()
        store.commit('cleanUserInfo')
        // 为了解决异地登陆被踢下线 用户中心页面不刷新问题 所以重新加载页面
        uni.reLaunch({
          url: '/pages/login/login'
        })
        reject({
          url,
          statusCode: 401,
          // data: {
          //   code: 401,
          //   message: "Request denied. Unauthorized access."
          // }
        })
        return
      }


      uni.request({
        url: baseCfg.url + url,
        method: method,
        data: method === 'post' || method === 'POST' ? JSON.stringify(data) : data,
        header: header,
        success(res) {
          if(res.statusCode!=200){

            if (res.statusCode == 409 || res.statusCode == 401) { // 其他设备登录 清除登录状态
              // 接口权限分为 未登录权限 非会员权限 会员权限 
              // 只有未登录状态才应该进来清除token和用户信息
              removeToken()
              store.commit('cleanUserInfo')
              // 为了解决异地登陆被踢下线 用户中心页面不刷新问题 所以重新加载页面
              uni.reLaunch({  
                url: '/pages/login/login'
              })
            }

            reject(res)
            return
          }
          const {code,message,data} = res.data;
          resolve(data.hasOwnProperty('result') ? data.result : data); 
        },
        fail(err) {
          //请求失败
          reject(err)
        },
		complete(){
			 showNavLoading && uni.hideNavigationBarLoading();
       showLoading && uni.hideLoading()
		}
    })
  });
}