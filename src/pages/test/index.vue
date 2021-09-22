<template>
    <view class="component-test">
        <template v-for="(item,index) in pages">
            <button @click="btnClick(item)" :key="index">{{item.name}}</button>
        </template>
    </view>
</template>

<script>
    /* message */

    export default {
        name: "test",
        data () {
            return {
                pages:[
                    {name:'图标预览',path:'/pages/test/iconPreview'},
                ],
            };
        },
        methods: {
            btnClick(item){
                console.log(item)
                uni.navigateTo({ url: item.path })
            },
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .component-test{
        
    }
    button{
        margin: 30rpx auto;
        width:300rpx;
        font-size: 24rpx;
        line-height: 48rpx;
    }
</style>