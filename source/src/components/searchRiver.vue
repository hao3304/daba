<template>
    <div>
        <div class='header'>
            <span class="title">河流流域查询</span>
            <!--<el-input-->
                    <!--:icon='icons'-->
                    <!--:on-icon-click='onIconClick'-->
                    <!--size='small' placeholder='请输入河流流域名称' v-model='query' style='width:80%;' ></el-input>-->
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-river'>
            <el-tree :data='filterData' lazy highlight-current accordion @node-click='onNodeClick'  :load="loadNode" :props="props" >
            </el-tree>
        </div>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import { getRiverDam, getRivers } from '../modules/service.js';
    import Vue from 'vue/dist/vue.js';

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                treeData:[],
                props:{
                label: 'RiverName',
                children: 'children'
                },
                query:''
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
            },
            filterData(){
               return this.treeData;
            }
        },
        methods:{
            onClose(){
                this.$emit('close');
            },
            render(){
                getRivers().then((rep)=>{
                    this.treeData = rep.map((r)=>{
                        r.children=[];
                        return r;
                    });
                    this.dam.rivers = this.treeData;
                })
            },
            loadNode(node,resolve){
                if(node.data.RiverType){
                         getRivers({rivertype:2,riverid:node.data.RiverID}).then((rep)=>{
                            resolve(rep.map((r)=>{
                                r.children = [];
                                return r;
                            }))
                        })
                }else{
                    return resolve([]);
                }
            },
            onNodeClick(node){
               if(node.RiverType > 1){
                    getRiverDam({riverid:node.RiverID}).then((rep)=>{
                    })
               }
            },
            onIconClick(){this.query =''}
        },
        mounted(){
            $('.search-river').slimScroll({ height: document.documentElement.clientHeight - 37 });
             $(window).resize(function(){
                $('.search-river').slimScroll({ height: document.documentElement.clientHeight - 37 });
             });

             this.render();
        }
    }
</script>
