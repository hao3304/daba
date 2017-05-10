<template>
    <div>
        <div class='header'>
            <span class='title'>流域管理</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-region' style="background-color:#efefef">
                <div v-loading.body='loading' v-show='loading' style="height:200px;"></div>
            <el-checkbox-group v-model="checkList">
                <div v-for='l in list' style="line-height:28px;padding:0 10px;">
                    <el-checkbox :label="l.id">{{l.name}}</el-checkbox>
                </div>
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
                list:[
                ],
                source:{},
                loading:true,
                checkList:[]
            }
        },
        methods:{
            getData() {
                getRegion().then(rep=>{
                    this.source = rep;
                    this.list = this.trans(rep.features);
                    this.loading = false;
                })
            },
             onClose(){
                this.$emit('close');
            },
            trans(data) {
                return data.map(d=>{
                    return {name:d.properties.Name,id:d.properties.ID,area:d.geometry.coordinates[0][0]};
                })
            }
        },
        watch:{
            checkList() {
                let result = this.list.filter(l=>{
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
