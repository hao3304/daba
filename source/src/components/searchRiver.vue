<template>
    <div>
        <div class='header'>
            <span class="title">河流流域查询</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-river' v-loading.body='loading'>

            <el-tabs v-model="activeName">
                <el-tab-pane label="河流流域" name="first">
                    <el-tree :expand-on-click-node='false' style='width:100%' :render-content="renderContent" :data='filterData'  highlight-current accordion   :props="props" >
                    </el-tree>
                    <el-dialog size='large' top='5%' :visible='dialog' :before-close='onCloseDialog' :title='title' style='text-align:center;'>
                        <iframe v-if='dialog' style="border:none;height:420px;width:100%;" :src="'/profile.html?ids='+ids"></iframe>
                    </el-dialog>
                </el-tab-pane>
                <el-tab-pane label="自定义剖面" name="second">
                    <x-section v-if='activeName == "second"'></x-section>
                </el-tab-pane>
            </el-tabs>

        </div>


    </div>
</template>
<style lang='less'>
    .search-river{
        overflow-x:auto;
        .el-tree-node__content{
            .fa-search,.fa-bar-chart{
                display: none;
                color:#0099cc;
                margin:0 3px;
            }
            &:hover{
                .fa-search,.fa-bar-chart{
                    display: inline;
                    color: #2e8ded;
                }
            }
        }
    }
</style>
<script>
    import { getRiverDam, getRivers,querySubRiverIDs } from '../modules/service.js';
    import xSection from './section.vue';

    export default{
        store:['container','rightSpan','dam','_map'],
        data(){
            return{
                treeData:[],
                props:{
                label: 'name',
                children: 'children'
                },
                query:'',
                loading:true,
                dialog:false,
                ids:'',
                title:'',
                activeName:'first'
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
            onCloseDialog() {
                this.dialog = false;
            },
            render(){
                getRivers().then((rep)=>{
                    this.treeData = this.transData(JSON.parse(rep));
                    this.dam.rivers = this.treeData;
                    if(this.loading) {
                        this.loading = false;
                    }
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
            onNodeClick(node,type){
               let list = [];
               this.rightSpan.list = [];
               this.container.right = false;
                this._map.spin(true);
               querySubRiverIDs({riverId:node.id}).then(rep=>{
                    this._map.spin(false);
                    if(rep){
                        let ll = rep.objInfo.dataList.map(d=>String(d.RIVERID));
                        ll.push(node.id);
                        if(ll.length>0){
                             this.dam.list.forEach(d=>{
                                if(ll.indexOf(d.riverid)>-1){
                                    list.push(d);
                                }
                            });
                        debugger
                            if(type == 'section' && list.length <=2) {
                                return  this.$message({
                                  message: "相关大坝数量少于2个，无法绘制剖面，请选择其他流域查看！",
                                  type: 'warning'
                                });
                            }

                             if(list.length>0){

                                if(type == 'section') {

                                    this.ids = list.map(l=>l.dbid).join(',');
                                    this.title = node.name;
                                    this.dialog = true;

                                }else{
                                    this.rightSpan.list = list;
                                    this.rightSpan.name = node.name;
                                    this.container.right = true;
                                }


                            }
                        }
                    }
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
                        },
                        on:{
                            click(e){
                                e.stopPropagation();
                            }
                        }
                    }),
                    h('i',{
                       class:{
                        'fa':true,
                        'fa-search':true
                       },
                        domProps:{
                            innerHTML:'查看'
                        },
                       on:{
                            click(e){
                                e.stopPropagation();
                                self.onNodeClick(data);
                            }
                        }
                    }),
                    h('i',{
                       class:{
                        'fa':true,
                        'fa-bar-chart':true
                       },
                       domProps:{
                            innerHTML:'剖面'
                        },
                       on:{
                            click(e){
                                e.stopPropagation();
                                self.onNodeClick(data,'section');
                            }
                        }
                    })
                ])
             ])
            }
        },
        components:{
            xSection
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
