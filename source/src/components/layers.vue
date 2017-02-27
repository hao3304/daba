<template>
    <div class="map-layer" :class="{expand:expand}" >
        <div class="map-layer-card normal" @click='active="normal"' :class="{active:active=='normal'}">
            <span>交通图</span>
        </div>
        <div class="map-layer-card earth" @click='active="earth"' :class="{active:active=='earth'}">
            <span>卫星图</span>
        </div>
    </div>
</template>
<style lang='less'>
    .map-layer{
        position: absolute;
        z-index: 999;
        background-color: rgba(255,255,255,.2);
        border-radius: 4px;
        padding: 4px;
        width:86px;
        height:60px;
        transition: all .4s;
        -moz-transition: all .4s;
        -webkit-transition: all .4s;
        -o-transition: all .4s;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.12), 0px 0px 6px 0px rgba(0,0,0,0.04);

        .map-layer-card{
            width: 86px;
            height: 60px;
            cursor: pointer;
            position: relative;
            box-sizing: border-box;
            border-radius: 2px;
            span{
                position: absolute;
                bottom: 0;
                right: 0;
                color: #fff;
                font-size: 12px;
                border-radius: 2px;
                padding: 2px;
            }
        }
        .normal{
            background-image: url("/static/images/maptype.png");
            background-position: 0 0;
        }

        .earth{
            background-image: url("/static/images/maptype.png");
            background-position: 0 -60px;
            position: absolute;
            right: 4px;
            top:4px;
        }

        &:hover{
            width: 176px;
            background-color: #fff;
            padding: 4px;
            .map-layer-card{
                &.active{
                    border:1px solid #3385ff;
                }
                span{
                    background-color: #3385ff;
                }
            }
         }
    }

</style>
<script>

    export default{
        data(){
            return {
                expand:false,
                active:'normal'
            }
        },
        watch:{
            active(type){
                this.$emit('change',type);
            }
        }
    }
</script>
