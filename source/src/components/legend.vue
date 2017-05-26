<template>
    <div>
        <span class="legend-button" v-show='!info' @click='info = true'>
            <i class="fa fa-eye"></i>
        </span>
        <transition name='legend'>
            <el-button v-show='info' @click='info=false' style='position:absolute;color:#20a0ff;margin-top:-15px;left:-5px;z-index:1000;'  type="text" icon='circle-close'></el-button>
        </transition>
        <transition name='legend'>
            <el-tabs type="border-card" v-model='tab' v-show='info' >
                <el-tab-pane label="地图图例" name="first">
                    <div v-show='type == "normal"'>
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
                        <ul class="legend-list" style="padding-left:30px;">
                            <li v-for="l in stat" v-if='l.children.length>0'>
                                <el-checkbox :label="l.legendName" v-model='layer.legend'>
                                    <img :src="l.iconPath" :alt="l.legendName">
                                    <span style='font-size:12px;'>{{l.legendName}}</span>
                                    <a style='font-size:12px;' @click='onLegendClick(l)' href='javascript:;'>[{{l.children.length}}]</a></el-checkbox>
                            </li>
                        </ul>

                    </div>
                    <div v-show='type == "river"'>
                        <ul class="legend-list" style="padding-left:30px;">
                            <li v-for="l in stat2" v-if='l.children.length>0'>
                                <el-checkbox :label="l.name" v-model='layer.legend2'>
                                    <img :src="l.icon" style="width:28px;height:18px;border:1px solid #ddd" :alt="l.name">
                                    <span style='font-size:12px;'>{{l.name}}</span>
                                </el-checkbox>
                            </li>
                        </ul>
                    </div>

                </el-tab-pane>
                <el-tab-pane  v-show='type =="normal"' label="图层控制" name="second">

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
                                v-model='area'
                                style="float: right"
                                on-text="显示"
                                off-text="隐藏">
                        </el-switch>
                    </div>
                    <!--<div class="control-list">-->
                        <!--<span>显示河流</span>-->
                        <!--<el-switch-->
                                <!--style="float: right"-->
                                <!--on-text="显示"-->
                                <!--off-text="隐藏">-->
                        <!--</el-switch>-->
                    <!--</div>-->
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
            line-height:22px;
            color:#333;
            img{
                width: 20px;
                height: 20px;
                vertical-align: middle;
            }

            .el-checkbox__inner{
                width:14px;
                height:14px;
                &:after{
                     height: 6px;
                     left: 3px
                 }
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
        store:['dam','layer','rightSpan','container'],
        props:['type'],
        data(){
            return {
                legend:[],
                info:false,
                tooltip:false,
                loading:false,
                area:true,
                tab:'first',
                riverLegend:[
                    {name:'已建',icon:'/static/images/yijian.png',children:[]},
                    {name:'在建',icon:'/static/images/zaijian.png',children:[]},
                    {name:'前期',icon:'/static/images/qianqi.png',children:[]},
                    {name:'规划',icon:'/static/images/guihua.png',children:[]}
                ]
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
            },
            stat2(){

                this.riverLegend.forEach(r=>r.children = []);

                this.dam.list.forEach((d)=>{
                         if(d.kind.indexOf('在建')>-1) {
                                this.riverLegend[1].children.push(d);
                           }else if(d.kind.indexOf('前期')>-1){
                                this.riverLegend[2].children.push(d);
                           }else if(d.kind.indexOf('规划')>-1){
                                 this.riverLegend[3].children.push(d);
                           }else{
                                this.riverLegend[0].children.push(d);
                           }
                    })
                return this.riverLegend;
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
                this.container.right = true;
                this.container.left = false;
            }
        },
        watch:{
            tooltip(t){
                this.$emit('tooltip-change',t);
            },
            area(t){
                this.$emit('area-change',t);
            },
            layer:{
                deep:true,
                handler(){
                    if(this.loading){
                        this.$emit('change');
                    }
                }
            },
            type(t) {

                if(t == 'river') {
                    this.info = true;
                }
            }
        },
        mounted(){
            this.render();
        }
    }
</script>
