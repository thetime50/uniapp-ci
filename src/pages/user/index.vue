<template>
	<view class="page" :style='{paddingTop:titleTop + 17 + "px"}'>
		<mHeader />
		<!-- 标题 -->
		<view class='pageTitle' :style='{top:titleTop + "px"}'>个人中心</view>
		
		<test />
		
	</view>
</template>

<script>
import test from 'pages/test/index.vue'

export default {
	name: "component_name",
	components: {
		test,
	},
	data () {
		return {
			//页面标题与顶部的距离
			titleTop:0,
			//导航
			navs:[],
		};
	},
	mounted () {
		let navs = [
			{
				text:"我的关注",
				path:"/pages/user/focus/index",
				icon:'focus',
			},
		]

		this.navs = navs
	},
	computed:{
	},
	methods:{
		// 
	},
	onReady(){
		//获取胶囊按钮的布局位置信息
		uni.getSystemInfo({
			success:(e)=>{
				//获取状态栏高度
				let statusBarHeight = e.statusBarHeight;
				
				//获取胶囊按钮的信息
				let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.titleTop = menuButtonInfo.top + menuButtonInfo.height / 2;
			}
		});
	},
}
</script>

<style lang="scss" scoped>
	.page{
		position: relative;
		min-height: 100vh;
	}
</style>
