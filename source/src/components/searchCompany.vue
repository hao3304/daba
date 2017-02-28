<template>
    <div>
        <div class='header'>
            <el-input size='small' placeholder='主管名称查询' v-model='query' style='width:80%;' ></el-input>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-company'>
            <el-tree :data='filterData' lazy highlight-current accordion @node-click='onNodeClick'  :load="loadNode" :props="props" >
            </el-tree>
        </div>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import {getDma,getZGDWList} from '../modules/service.js';
    import Vue from 'vue/dist/vue.js';

    export default{
        store:['container','rightSpan'],
        data(){
            return{
                treeData:[],
                props:{
                label: 'itemName',
                children: 'children'
                },
                query:''
            }
        },
        computed:{
            filterData(){
                if(this.query){
                    return this.treeData.filter((t)=>{
                          return t.itemName.indexOf(this.query)>-1;
                    })
                }else{
                    return this.treeData;
                }
            }
        },
        methods:{
            onClose(){
                this.$emit('close');
            },
            render(){
                getZGDWList().then((rep)=>{
                    let result = JSON.parse(rep);
                    result.shift();
                    this.treeData = result.map((r)=>{
                        r.children=[];
                        return r;
                    });
                })
            },
            loadNode(node,resolve){
                if(node.id != 0){
                    if(node.data.itemValue){
                         getDma({zgdw:node.data.itemValue}).then((rep)=>{
                            resolve(rep.map((r)=>{
                                r.itemName = r.dbmc;
                                r.children = [];
                                return r;
                            }))
                        })
                    }else{
                        return resolve([]);
                    }
                }
            },
            onNodeClick(node){
                if(node.dbid){
                    this.$emit('node-click',node);
                }
            }
        },
        mounted(){
            $('.search-company').slimScroll({ height: document.documentElement.clientHeight - 85 });
             $(window).resize(function(){
                $('.search-company').slimScroll({ height: document.documentElement.clientHeight - 85 });
             });

             this.render();
        }
    }
</script>
