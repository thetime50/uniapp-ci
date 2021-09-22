<script>
	import {mapActions} from 'vuex'

	export default {
		globalData: {
			//系统
			system: ''
		},
		onLaunch: function(e) {
			//获取系统信息
			this.globalData.system = uni.getSystemInfoSync().platform;
			this.overShare() // 为每个页面注册回调开启分享
		},
		onShow: function() {
			console.log('App Show')
			this.userInfoUpdata()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapActions(['userInfoAction']),
			async userInfoUpdata(){
				if(getToken()){
					await this.userInfoAction()
				}
			},
			overShare(){
				uni.onAppRoute((route) => {
					uni.showShareMenu({
						withShareTicket: true,
						menus: [ 'shareAppMessage','shareTimeline'],
						success:()=>{
							// console.log(`success`, )
						},
						fail:()=>{
							// console.log(`fail`, )
						}
					})
				})
			},
		},
	}
</script>

<style lang="scss">
</style>
