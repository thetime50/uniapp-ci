<template>
    <view class="component-dialog" v-if="value" @click.stop="()=>{} /*拦截事件冒泡*/">
        <view class="dialog">
            <view class="close" @click="value_=false">
                <uni-icons type="closeempty" size="14px"/>
            </view>
            <slot />
        </view>
    </view>
</template>

<script>
    export default {
        name: "dialog",
        props:{
            value:{type:Boolean, default:false},
            title:{type:String, default:''},
        },
        data () {
            return {
            };
        },
        computed: {
            value_:{
                get(){
                    return this.value
                },
                set(val){
                    this.$emit('input',val)
                },
            }
        },
        watch: {
            value_:{
                handler(){
                    if(!this.value_){
                        console.log('showTabBar')
                        uni.showTabBar({})
                    }else{
                        console.log('hideTabBar')
                        uni.hideTabBar({});
                    }
                },
                immediate:true,
            },
        }
    }
</script>

<style lang="scss" scoped>
.component-dialog{
    position: fixed;
    z-index: 1000;
    top:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    .dialog{
        position: relative;
        padding: 62rpx 82rpx 70rpx 82rpx; 
        width: 706rpx;
        margin: 410rpx auto;
        background: #FFFFFF;
        border-radius: 10px;
    }

    .close{
        position: absolute;
        top: 58rpx;
        right: 42rpx;
        // font-size: 28rpx;
        color: rgba(0, 0, 0, 0.9);
    }
}
</style>