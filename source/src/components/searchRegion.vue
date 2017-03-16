<template>
    <div>
        <div class='header'>
            <span class='title'>省市区域查询</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-region'>

            <el-collapse v-model="activeName" accordion >
                <el-collapse-item  name="1">

                    <span slot="title">
                        全国行政区域
                    </span>

                    <el-tree show-checkbox
                             ref='provinceTree'
                             :data='province'
                             v-loading='loading'
                             node-key="RegionCode"
                             highlight-current
                             accordion
                             lazy
                             @check-change='onCheckChange'
                             :load="loadNode" :props="props" >
                    </el-tree>
                </el-collapse-item>
                <el-collapse-item title="自定义区域" name="2">
                    <el-tree
                            highlight-current
                            accordion
                            v-loading='loading2'
                            :data='custom'
                            lazy
                            :load='loadCustom'
                            :props='props'
                            @node-click='onNodeClick'
                    >

                    </el-tree>

                </el-collapse-item>
            </el-collapse>

        </div>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import {getDma,getPlaceNames,getCustomPlaceNames,queryByCustomNames} from '../modules/service.js';
    import Vue from 'vue/dist/vue.js';

    export default{
        store:['container','rightSpan'],
        data(){
            return{
                province:[
                ],
                custom:[],
                props:{
                    label: 'RegionName',
                    children: 'children'
                },
                query:'',
                activeName:'',
                loading:true,
                loading2:true
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
            }
        },
        methods:{
            onClose(){
                this.$emit('close');
                this.$refs.provinceTree.setCheckedKeys([]);
                this.$emit('select',[]);
            },
            renderProvince(){
                getPlaceNames({regiontype:''}).then((result)=>{
                    this.province = this.transData(result);
                    this.loading = false;
                })
            },
            renderCustom(){
                this.loading2 = true;
                getCustomPlaceNames().then((rep)=>{
                    this.loading2 = false;
                    this.custom = this.transCustomData(rep);
                })
            },
            transCustomData(data){
                return data.map((name)=>{
                    return {RegionName:name,children:[],type:'big'};
                })
            },
            loadCustom(node,resolve){
                if(node.data.type =='big'){
                    queryByCustomNames({customname:node.data.RegionName}).then((rep)=>{
                        resolve(rep);
                    })
                }else{
                    resolve([]);
                }
            },
            loadNode(node,resolve){
                if(node.id !=1){
                    if(node.data.type == 'big'){
                        let result;
                        this.province.forEach((p)=>{
                            if(p.RegionName == node.data.RegionName){
                                result = p;
                            }
                        });
                        resolve(result.children);
                    }else if(node.data.BigRegionName){
                        getPlaceNames({regiontype:'city',regioncode:node.data.RegionCode}).then((rep)=>{
                            resolve(rep||[]);
                        })

                    }else{
                    resolve([]);
                    }
                }
            },
            transData(data){
                let p = {},result = [],index = 0;
                data.forEach((d)=>{
                    p[d.BigRegionName] = {children:[]};
                });

                for(let i in p){
                    let item = {RegionName:i,children:[],type:'big',RegionCode:index}
                    index ++;
                    data.forEach((d)=>{
                        if(d.BigRegionName == i){
                            item.children.push(d);
                        }
                    })
                    result.push(item);
                }
                return result;
            },
            onIconClick(){this.query =''},
            onCheckChange(){
                this.$emit('select',this.$refs.provinceTree.getCheckedNodes());
            },
            onNodeClick(node){
                if(node.type != 'big'){
                    this.$refs.provinceTree.setCheckedKeys([]);
                    this.$emit('select',[node]);
                }
            }
        },
        mounted(){
            $('.search-region').slimScroll({ height: document.documentElement.clientHeight - 37 });
             $(window).resize(function(){
                $('.search-region').slimScroll({ height: document.documentElement.clientHeight - 37 });
             });
        },
        watch:{
            activeName(active){
                if(active == '1' && this.province.length == 0){
                   this.renderProvince();
                }else if(active == '2' && this.custom.length == 0){
                    this.renderCustom();
                }
            }
        }
    }
</script>
