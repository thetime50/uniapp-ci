<template>
    <view class="component-m-header" :style="blockStyle">
            <view class="fixed-block" :style="fixedStyle"> 
                <uni-icons v-if="back" type="arrowleft" size="24" color="rgba(0,0,0)" @click="gotoBack"/> 
            </view> 


        <!-- </text> -->
    </view>
</template>

<script>
    /* message */

    export default {
        name: "m-header",
        props:{
            back:{type:Boolean,default:false}
        },
        data () {
            return {
                blockStyle:'',
                fixedStyle:'',
            };
        },
        mounted () {
            //获取胶囊按钮的布局位置信息
            uni.getSystemInfo({
                success:(e)=>{
                    //获取状态栏高度
                    let statusBarHeight = e.statusBarHeight;
                    //获取胶囊按钮的信息
                    let style = {}
                    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
                    console.log(menuButtonInfo)
                    style = {
                        'margin-top':menuButtonInfo.top+'px',
                        'height':menuButtonInfo.height+'px',
                    }

                    this.blockStyle = Object.keys(style).reduce((t,v,i,a)=>{
                        return t + `${v}:${style[v]};`
                    },'')

                    let fixedStyle = {
                        'top':menuButtonInfo.top+'px',
                        'height':menuButtonInfo.height+'px',
                    }
                    this.fixedStyle = Object.keys(fixedStyle).reduce((t,v,i,a)=>{
                        return t + `${v}:${style[v]};`
                    },'')
                }
            });
        },
        methods: {
            gotoBack(){
                uni.navigateBack()
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .component-m-header{
        margin: 0 14rpx;
    }
    .fixed-block{
        position: fixed ;
        width:100%;
    }
</style>