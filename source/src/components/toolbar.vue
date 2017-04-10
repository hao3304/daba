<template>
    <div class='toolbar'>
        <div class='header'>
            <span class='title'>工具栏</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <el-row :gutter='5' style='margin-top:10px'>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn' :class="{active:active =='Polyline'}" @click='onToolbarClick("polyline")'>
                    <i class='iconfont icon-zhexian'></i>
                    <p>折线</p>
                </a>
            </el-col>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn'  :class="{active:active =='Rectangle'}" @click='onToolbarClick("Rectangle")'>
                    <i class='iconfont icon-juxing'></i>
                    <p>矩形</p>
                </a>
            </el-col>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn' :class="{active:active =='Polygon'}"  @click='onToolbarClick("Polygon")'>
                    <i class='iconfont icon-duobianxing'></i>
                    <p>多边形</p>
                </a>
            </el-col>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn'  :class="{active:active =='Circle'}" @click='onToolbarClick("Circle")'>
                    <i class='iconfont icon-yuanxing'></i>
                    <p>圆形</p>
                </a>
            </el-col>
        </el-row>
        <el-row :gutter='5' style='margin-top:10px'>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn' :class="{active:active =='measure-line'}"  @click='onToolbarClick("measure-line")'>
                    <i class='iconfont icon-juli'></i>
                    <p>距离</p>
                </a>
            </el-col>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn'  :class="{active:active =='measure-polygon'}" @click='onToolbarClick("measure-polygon")'>
                    <i class='iconfont icon-mianji'></i>
                    <p>面积</p>
                </a>
            </el-col>
        </el-row>
        <el-row :gutter='5' style='margin-top:10px'>
            <el-col :span='8' style='text-align:center;'>
                <a href='javascript:;' class='toolbar-btn'  :class="{active:active =='clear'}" @click='onToolbarClick("clear")'>
                    <i class='iconfont icon-qingchu'></i>
                    <p>清除</p>
                </a>
            </el-col>
        </el-row>
        <!--<el-dropdown @command="handleCommand" trigger="click">-->
            <!--<el-button icon="edit" size="small">-->
                <!--画笔<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>-->
            <!--</el-button>-->
            <!--<el-dropdown-menu slot="dropdown">-->
                <!--<el-dropdown-item command="Polyline">折线</el-dropdown-item>-->
                <!--<el-dropdown-item command="Rectangle">矩形</el-dropdown-item>-->
                <!--<el-dropdown-item command="Polygon">多边形</el-dropdown-item>-->
                <!--<el-dropdown-item command="Circle">圆形</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->

        <!--<el-button-group>-->
            <!--<el-button size="small"  @click="onToolbarClick('measure-line')" >-->
                <!--<i class="fa fa-share-alt"></i> 距离-->
            <!--</el-button>-->
            <!--<el-button size="small"  @click="onToolbarClick('measure-polygon')" >-->
                <!--<i class="fa fa-area-chart"></i> 面积-->
            <!--</el-button>-->
            <!--<el-button size="small"  @click="onToolbarClick('clear')" >-->
                <!--<i class="fa fa-trash"></i> 清除-->
            <!--</el-button>-->

        <!--</el-button-group>-->
    </div>
</template>
<style lang='less'>
    .toolbar{
        .toolbar-btn{
            display:inline-block;
            color:#666;
            text-decoration: none;
            width: 60px;
            height: 60px;
            padding-top:10px;
            border-radius:4px;
            .iconfont{
                font-size:26px;
            }
            p{
                margin:5px 0 0 0;
                padding:0;
                font-size:12px;
            }

            &:hover,&.active{
                background-color:#242245;
                color:#fff;
            }
        }
    }
</style>
<script>
    export default{
        data(){
            return{
                active:''
            }
        },
        methods:{
            onToolbarClick(type){
                this.active = type=='clear'?'':type;
                this.$emit('toolbar-click',type);
            },
            onClose(){
                this.$emit('close');
            }
        }
    }
</script>
