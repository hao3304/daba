<template>
    <div style="opacity: 0.8">
        <span class="legend-button" v-show='!info' @click='info = true'>
            <i class="fa fa-eye"></i>
        </span>
        <transition name='legend'>
            <el-tabs type="border-card" v-model='tab' v-show='info' >
                <el-tab-pane label="地图图例" name="first">
                    <ul class="legend-list" style="margin-bottom:10px;">
                        <li v-for="l in stat">
                            <el-checkbox :label="l.legendName" v-model='layer.legend'>
                                <img :src="l.iconPath" :alt="l.legendName">
                                <span style='font-size:12px;'>{{l.legendName}}</span>
                                <a style='font-size:12px;' @click='onLegendClick(l)' href='javascript:;'>[{{l.children.length}}]</a></el-checkbox>
                        </li>
                    </ul>
                    <div class='hidden_button' @click='info=false'>
                        <i class="fa fa-angle-up"> </i>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="图层控制" name="second">
                    <div style="text-align:center;height:30px;" >
                        <el-checkbox-group size='small' v-model='layer.state'>
                            <el-checkbox label="已核"></el-checkbox>
                            <el-checkbox label="未核"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="control-list">
                        <el-radio-group size='small' v-model='layer.mode' >
                            <el-radio-button label="全国"></el-radio-button>
                            <el-radio-button label="电力"></el-radio-button>
                            <el-radio-button label="水利"></el-radio-button>
                            <el-radio-button label="不明"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <hr/>
                    <div class="control-list">
                        <span>显示标签</span>
                        <el-switch
                                v-model='tooltip'
                                style="float: right"
                                on-text="显示"
                                off-text="隐藏">
                        </el-switch>
                    </div>
                    <div class="control-list">
                        <span>显示区域</span>
                        <el-switch
                                style="float: right"
                                on-text="显示"
                                off-text="隐藏">
                        </el-switch>
                    </div>
                    <div class="control-list">
                        <span>显示河流</span>
                        <el-switch
                                style="float: right"
                                on-text="显示"
                                off-text="隐藏">
                        </el-switch>
                    </div>
                    <div class='hidden_button' @click='info=false'>
                        <i class="fa fa-angle-up"> </i>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </transition>
    </div>
</template>
<style lang='less'>
    .legend-list{
        padding: 0;
        margin:0;
        li{
            list-style: none;
            font-size:12px;
            line-height:24px;
            color:#333;
            img{
                width: 20px;
                height: 20px;
                vertical-align: middle;
            }
        }
    }

    .hidden_button{
        text-align: center;
        position: absolute;
        width: 100%;
        height: 20px;
        bottom: 0;
        left: 0;
        cursor: pointer;
        transition: all .2s;
        color: #666;
        &:hover{
            background-color: #efefef;
            color: #20a0ff;
        }
    }

    .legend-button{
        height: 26px;
        width: 26px;
        line-height: 26px;
        border-radius: 4px;
        background-color: #fff;
        text-align: center;
        box-sizing: border-box;
        display: inline-block;
        box-shadow: 0 1px 5px rgba(0,0,0,0.65);
        cursor: pointer;
        position: absolute;
        top:0;
        right: 0;
        &:active,&:hover{
            background-color: #efefef;
        }
    }

    .el-switch--wide .el-switch__label.el-switch__label--left span{
        font-size: 14px;
    }
    .el-switch--wide .el-switch__label.el-switch__label--right span{
        font-size: 14px;
    }

    .control-list{
        height:38px;
        >span{
            font-size: 14px;
            padding-top: 2px;
            position: absolute;
        }

    }

    .legend-enter-active{
        animation: legend-in .4s;
        transform-origin: 100% 0 0;
    }


    .legend-leave-active{
        animation: legend-leave .4s;
        transform-origin: 100% 0 0;
    }

    @keyframes legend-in {
        0%{
            transform: scale(0);
        }
        100%{
            transform: scale(1);
        }
    }
    @keyframes legend-leave {
        0%{
            transform: scaleY(1);
        }
        100%{
            transform: scaleY(0);
        }
    }

</style>
<script>
    import {getLegend} from '../modules/service';

    export default{
        store:['dam','layer','rightSpan'],
        data(){
            return {
                legend:[],
                info:false,
                tooltip:false,
                loading:false,
                tab:'first'
            }
        },
        computed:{
            stat(){
                var list = [];
                this.legend.forEach((l)=>{
                    l.children = [];
                    this.dam.list.forEach((d)=>{
                        if(l.legendName == d.kind){
                            l.children.push(d);
                        }
                    })
                    list.push(l);
                });
                return list;
            }
        },
        methods:{
            render(){
                getLegend().then((rep)=>{
                    this.legend = rep;
                    this.legend.forEach((l)=>{
                        this.layer.legend.push(l.legendName);
                    });
                    this.loading = true;
                })
            },
            onLegendClick(legend){
                this.rightSpan.list = legend.children;
                this.rightSpan.name = legend.legendName;
            }
        },
        watch:{
            tooltip(t){
                 this.$emit('tooltip-change',t);
            },
            layer:{
                deep:true,
                handler(){
                    if(this.loading&&this.dam.list.length>0){
                         this.$emit('change');
                    }
                }
            }
        },
        mounted(){
            this.render();
        }
    }
</script>
