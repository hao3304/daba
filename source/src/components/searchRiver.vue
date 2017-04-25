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
            <el-tree :render-content="renderContent" :data='filterData'  highlight-current accordion   :props="props" >
            </el-tree>
        </div>
    </div>
</template>
<style lang='less'>
    .search-river{
        .el-tree-node__content{
            .fa-search{
                display: none;
                color:#0099cc;
            }
            &:hover{
                .fa-search{
                    display: inline;
                    color: #2e8ded;
                }
            }
        }
    }
</style>
<script>
    import { getRiverDam, getRivers,querySubRiverIDs } from '../modules/service.js';
    import Vue from 'vue/dist/vue.js';

    export default{
        store:['container','rightSpan','dam','_map'],
        data(){
            return{
                treeData:[],
                props:{
                label: 'name',
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
                    this.treeData = this.transData(JSON.parse(rep));
                    this.dam.rivers = this.treeData;
                })
            },
            transData(data) {
                   let list = [];
                   var getById = function(d){
                        let r = [];
                        for(var i in data) {
                            if(data[i].pId == d.id) {
                                r.push(data[i]);
                            }

                        }
                            if(r.length > 0 ){
                                d.children = r;
                                for(var i in r){
                                    getById(r[i]);
                                }
                            }
                   }

                   for(var i in data){
                    if(data[i].pId == 0){
                        data[i].children = [];
                        list.push(data[i]);
                        getById(data[i]);
                    }
                   }
                   return list;
            },
            onNodeClick(node){
               let list = [];
               this.rightSpan.list = [];
               this.container.right = false;
                this._map.spin(true);
               querySubRiverIDs({riverId:node.id}).then(rep=>{
                    if(rep){
                        let ll = rep.objInfo.dataList.map(d=>String(d.RIVERID));
                        if(ll.length>0){
                             this.dam.list.forEach(d=>{
                                if(ll.indexOf(d.riverid)>-1){
                                    list.push(d);
                                }
                            });

                             if(list.length>0){
                                this.rightSpan.list = list;
                                this.rightSpan.name = node.RiverName;
                                this.container.right = true;
                            }
                        }
                    }
                    this._map.spin(false);
               })
            },
            onIconClick(){this.query =''},
            renderContent(h, { node, data, store }){
            var self = this;
             return h('span',{

             },[
                h('span',{},[
                    h('span',{
                        domProps:{
                            innerHTML:data.name
                        },
                        style: {
                            fontSize:'14px'
                        }
                    }),
                    h('i',{
                       class:{
                        'fa':true,
                        'fa-search':true
                       },
                       on:{
                            click(e){
                                e.stopPropagation();
                                self.onNodeClick(data);
                            }
                        }
                    })
                ])
             ])
            }
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
