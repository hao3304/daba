<template>
    <div>
        <el-dropdown @command="handleCommand" trigger="click">
            <el-button icon="edit" size="small">
                画笔<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="Polyline">折线</el-dropdown-item>
                <el-dropdown-item command="Rectangle">矩形</el-dropdown-item>
                <el-dropdown-item command="Polygon">多边形</el-dropdown-item>
                <el-dropdown-item command="Circle">圆形</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <el-button-group>
            <el-button size="small"  @click="onToolbarClick('measure-line')" >
                <i class="fa fa-share-alt"></i> 距离
            </el-button>
            <el-button size="small"  @click="onToolbarClick('measure-polygon')" >
                <i class="fa fa-area-chart"></i> 面积
            </el-button>
            <el-button size="small"  @click="onToolbarClick('clear')" >
                <i class="fa fa-trash"></i> 清除
            </el-button>

        </el-button-group>
    </div>
</template>
<style lang='less'>

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
                this.$emit('toolbar-click',type);
            },
            handleCommand(type){
                this.$emit('toolbar-click',type);
            }
        }
    }
</script>
