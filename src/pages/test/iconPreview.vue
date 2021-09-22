<template>
    <view class="component-icon-preview flex mainJustify crossCenter">
        <template v-for="(item,index) in iconNames">
            <view class="item" :key="item">
                <m-icon class="icon" :name="item" 
                    @load="function(e){ loadHandle(index,e)}"
                    @click.native="copyClick('comp',index)"/>
                <!-- <view class="icon" :name="item"/> -->
                <view class="name" @click="copyClick('name',index)">{{index}} name: {{item}}</view>
                <view class="px" @click="copyClick('px',index)">
                    {{size[index].width/2}}px {{size[index].height/2}}px
                </view>
                <view class="rpx" @click="copyClick('rpx',index)">
                    {{size[index].width}}rpx {{size[index].height}}rpx
                </view>
            </view>
        </template>
    </view>
</template>

<script>
    /* message */
    import {iconNames} from '@/components/mIcon/mIcon.js' //图标组件
    import mIcon from '../../components/mIcon/mIcon.vue';

    export default {
  components: { mIcon },
        name: "icon-preview",
        data () {
            return {
                iconNames,
                size:Array.from({length:iconNames.length},()=>{return {}})
            };
        },
        methods: {
            loadHandle(index,e){
                this.$set(this.size,index,e.detail)
            },
            async copyClick(type,index){
                let res = ''
                switch(type){
                    case 'comp':
                        res = `<m-icon name="${this.iconNames[index]}" />`
                        break;
                    case 'name':
                        res = this.iconNames[index]
                        break;
                    case 'px':
                        res = `width:${this.size[index].width/2}px; height:${this.size[index].height/2}px;`
                        break;
                    case 'rpx':
                        res = `width:${this.size[index].width}rpx; height:${this.size[index].height}rpx;`
                        break;
                }
				await uni.setClipboardData({
				    data: res,
				});
                uni.showToast({
                    title: `已复制 '${res}'`,
                    icon: 'none'
                })
                
            },
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .component-icon-preview{
        flex-wrap: wrap;
    }
    .item{
        width: 22%;
        font-size: 20rpx;
    }
    .icon{
        display: block;
        width: 100%;
        height: 22vw;
        // height: 200rpx;
        color: #f88;
    }
</style>