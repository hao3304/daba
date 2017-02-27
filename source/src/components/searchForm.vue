<template>
    <div >
        <div class='header'>
            <span class='title'>大坝综合查询</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <el-form class='search-form' :model='model' style='padding-right:10px;padding-top:5px;'  label-width="80px">
            <el-form-item :label="f.conditionName" v-for='f in form'>
                <el-select size='small' v-if='f.conditionType =="select"' v-model='model[f.conditionCode]'>
                    <el-option v-for='i in f.items' :label='i.itemName' :value='i.itemValue' ></el-option>
                </el-select>
                <el-checkbox-group  v-model="model[f.conditionCode]" v-if='f.conditionType=="checkbox"'>
                    <el-checkbox size='small' v-for='i in f.items'  :label='i.itemName' :name='i.itemValue' v-if='i.itemName!="请选择"' ></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <hr>
            <div style='text-align:center;' >
                <el-button type="primary" size='small'  icon="search" @click="onSubmit">查询</el-button>
                <el-button size='small' @click='onReset'>重置</el-button>
            </div>
        </el-form>

    </div>
</template>
<style lang='less'>
    .search-form{
        .el-form-item{
            margin-bottom:0px;
        }
        .el-checkbox__label{
            font-size:12px;
        }
    }
</style>
<script>
    import {getSearchCondition} from '../modules/service.js';
    import Vue from 'vue/dist/vue.js';

    export default{
        store:['container'],
        data(){
            return{
                form:[],
                model:{}
            }
        },
        methods:{
            onClose(){
                this.$emit('close');
            },
            render(){
                getSearchCondition().then((rep)=>{
                    rep = JSON.parse(rep);
                    for(let i in rep){
                        Vue.set(this.model,rep[i].conditionCode,rep[i].conditionType == 'checkbox'?[]:'');
                    }
                    this._m = {...this.model};
                    this.form = rep;
                });
            },
            onSubmit(){
            },
            onReset(){
                this.model = {...this._m};
            },
            onSubmit(){
                this.container.mode = 'all';
            }
        },
        mounted(){
            this.render();
            $('.search-form').slimScroll({ height: document.documentElement.clientHeight - 84 });
             $(window).resize(function(){
                $('.search-form').slimScroll({ height: document.documentElement.clientHeight - 84 });
             });
        }
    }
</script>
