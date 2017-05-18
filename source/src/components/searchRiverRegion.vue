<template>
    <div>
        <div class='header'>
            <span class='title'>流域管理</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-region' style="background-color:#efefef" v-loading.body='loading'>
            <el-checkbox-group v-model="checkList">
                <el-collapse v-model="activeName" accordion >
                    <el-collapse-item v-for='(c,index) in list' :title="c.name" :name="index">
                        <div v-for='l in c.children' style="line-height:28px;padding:0 10px;">
                            <el-checkbox :label="l.id">{{l.name}}</el-checkbox>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-checkbox-group>
        </div>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import {getRegion} from '../modules/service.js';

    export default{
        store:['container','rightSpan'],
        data(){
            return{
                 activeName:null,
                list:[
                    {
                        name:'长江流域',
                        id:1,
                        children:[]
                    },
                    {
                        name:'黄河流域',
                        id:2,
                        children:[]
                    },
                    {
                        name:'珠海流域',
                        id:3,
                        children:[]
                    },
                    {
                        name:'东南沿海诸河',
                        id:4,
                        children:[]
                    },
                    {
                        name:'西南国际诸河',
                        id:5,
                        children:[]
                    }
                ],

                source:[],
                loading:true,
                checkList:[]
            }
        },
        methods:{
            getData() {
                getRegion().then(rep=>{
                    this.trans(rep.features);
                    this.loading = false;
                })
            },
             onClose(){
                this.$emit('close');
            },
            trans(data) {
                let result = this.source =  data.map(d=>{
                    return {name:d.properties.Name,pid:d.properties.PARENT_ID,id:d.properties.ID,area:d.geometry.coordinates[0][0]};
                });
                 this.list.forEach(l=>{
                        result.forEach(r=>{
                            if(l.id == r.pid) {
                                l.children.push(r)
                            }

                        })
                    })
            }
        },
        watch:{
            checkList() {
                let result = this.source.filter(l=>{
                    return this.checkList.indexOf(l.id) > -1
                });

                this.$emit('check',result.map(r=>{
                    return {
                            "type":"Feature",
                            "properties": { "name":r.name,"id":r.id},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates":[r.area]
                            }
                        }
                }))
            }
        },
        mounted(){
           $(this.$el).find('.search-region').slimScroll({ height: document.documentElement.clientHeight - 37 });
            this.getData();
        }
    }
</script>
