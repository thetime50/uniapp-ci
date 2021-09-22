<template>
    <image class="component-m-icon"
        v-if="type=='img'"
        :src="src"
         mode='aspectFill' 
         :style="styleRes"
         @load="(e)=>reEmit('load',e)"
         @error="(e)=>reEmit('error',e)"
        >
        <!-- v-bind="$attrs" -->
        <!-- v-on="$listeners" -->
    </image>
</template>

<script>
    import {iconMap} from './mIcon.js'

    export default {
        name: "m-icon",
        props:{
            name:{type:String },
            type:{type:String, default:"img"},
            styleStr:{type:String|null, default:undefined}, // 不传使用默认rpx 传''绑定''值
        },
        data () {
            return {
                detail:{ // default size
                    width:20,
                    height:20,
                }
            };
        },
        computed:{
            src(){
                return iconMap[this.name || 'label'] || iconMap.label
            },
            styleRes(){
                if(this.styleStr !== null){
                    return this.styleStr
                }
                // return { // 不支持对象?
                //     width:`${this.detail.width}rpx` ,
                //     height:`${this.detail.height}rpx`,
                // }
                return `width:${this.detail.width}rpx;height:${this.detail.height}rpx`
            },
        },
        methods: {
            reEmit(event,e){
                if(event=='load'){
                    this.detail = e.detail
                }
                this.$emit(event,e)
            },
        },
        // watch: {
        //     styleRes:{
        //         handler(){
        //             console.log('styleRes', this.styleRes,typeof this.styleRes,this.styleStr)
        //         },
        //         immediate:true,
        //     },
        // }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .component-m-icon{
        
    }
    image{
        max-width: 100%;
        max-height: 100%;
    }
</style>