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
                    <el-checkbox size='small' v-for='i in f.items'  :label='i.itemValue'  v-if='i.itemName!="请选择"' >{{i.itemName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <hr>
            <div style='text-align:center;' >
                <el-button type="primary" size='small' :disabled='!disabled' icon="search" @click="onSubmit">查询</el-button>
                <el-button size='small'  :disabled='!disabled' @click='onReset'>重置</el-button>
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
    import {getSearchCondition,getDma} from '../modules/service.js';
    import Vue from 'vue/dist/vue.js';

    export default{
        store:['container','rightSpan'],
        data(){
            return{
                form:[],
                model:{}
            }
        },
        computed:{
            disabled(){
                let d = false;
                for(let i in this.model){
                    if(typeof this.model[i] == 'object'){
                        if(this.model[i].length>0){
                            return true;
                        }
                    }else{
                        if(this.model[i] != ''){
                            return true;
                        }
                    }
                }
                return d;
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
            getQuery(){
                let query = {};
                for(var i in this.model){
                    if(typeof this.model[i] == 'object'){
                        query[i] = this.model[i].join(',');
                    }else{
                        query[i] = this.model[i];
                    }
                }
                return query;
            },
            onSubmit(){
                let query = this.getQuery();
                layer.load(1);
                getDma(query).then((rep)=>{
                    this.rightSpan.list = rep;
                    this.rightSpan.name = '综合查询结果';
                    this.container.left = true;
                    this.container.right = true;
                    layer.closeAll();
                })
            }
        },
        mounted(){
            this.render();
            $('.search-form').slimScroll({ height: document.documentElement.clientHeight - 85 });
             $(window).resize(function(){
                $('.search-form').slimScroll({ height: document.documentElement.clientHeight - 85 });
             });
        }
    }
</script>
