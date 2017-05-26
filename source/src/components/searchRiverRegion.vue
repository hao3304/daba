<template>
    <div>
        <div class='header'>
            <span class='title'>流域管理</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-region' style="background-color:#efefef" v-loading.body='loading'>
            <el-button @click='dialog = true' v-show='checkList.length>0' icon='plus' style='width:100%' type='primary'>叠加行政区域</el-button>
            <!--<el-checkbox-group v-model="checkList">-->
                <!--<el-collapse v-model="activeName" accordion >-->
                    <!--<el-collapse-item v-for='(c,index) in list'  :name="index">-->
                        <!--<span slot='title'>-->
                            <!--<span :class="{'is-checked':c.checked}" @click="onCheckAll(c,$event)" class="el-checkbox__input"><span class="el-checkbox__inner"></span></span>-->
                            <!--&nbsp;{{c.name}}-->
                        <!--</span>-->
                        <!--<div v-for='l in c.children' style="line-height:28px;padding:0 10px;">-->
                            <!--<el-checkbox :label="l.id">{{l.name}}</el-checkbox>-->
                        <!--</div>-->
                    <!--</el-collapse-item>-->
                <!--</el-collapse>-->
            <!--</el-checkbox-group>-->
            <div style='padding:5px;' v-show='canClick'>
                <el-button style='width:100%' @click='onShow'  type='primary'>确定</el-button>
            </div>
            <el-tree
                    :data="list"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    @check-change=' canClick = true'
                    highlight-current
                    :props="defaultProps">
            </el-tree>


        </div>
        <el-dialog :visible='dialog' title='行政区域' :before-close='onCloseDialog'>
            <div :style="{height:height - 300 +'px'}" style="overflow-y:auto">
                <search-region @select='onSelectRegion' :inline='true'></search-region>
            </div>
            <span slot='footer'>
                <el-button type='primary' @click='onCover'>确定</el-button>
                <el-button @click='dialog = false'>取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import {getRegion} from '../modules/service.js';
    const jsts = require('jsts');
    import searchRegion from './searchRegion.vue';

    export default{
        store:['container','rightSpan'],
        data(){
            return{
                dialog:false,
                 activeName:null,
                 canClick:false,
                list:[
                    {
                        name:'长江流域',
                        id:1,
                        children:[],
                        checked:false
                    },
                    {
                        name:'黄河流域',
                        id:2,
                        children:[],
                        checked:false
                    },
                    {
                        name:'珠海流域',
                        id:3,
                        children:[],
                        checked:false
                    },
                    {
                        name:'东南沿海诸河',
                        id:4,
                        children:[],
                        checked:false
                    },
                    {
                        name:'西南国际诸河',
                        id:5,
                        children:[],
                        checked:false
                    }
                ],

                source:[],
                loading:true,
                checkList:[],
                regions:[],
                defaultProps: {
                  children: 'children',
                  label: 'name'
                },
                height:document.documentElement.clientHeight
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
            },
            onCloseDialog() {
                this.dialog = false;
            },
            onSelectRegion(selects) {
                 this.region = selects;
            },
            onCover() {
                let result = this.source.filter(l=>{
                    return this.checkList.indexOf(l.id) > -1
                });

                var reader = new jsts.io.WKTReader();
                if(result.length == 0) {
                     return  this.$message({
                                  message: "请先选择流域！",
                                  type: 'warning'
                                });
                }

                let a;
                result.forEach((r,index)=>{
                    let geo = this.transGeoJSON(r.area);
                    if(index == 0) {
                        a = reader.read(geo);
                    }else{
                        a = a.union(reader.read(geo));
                    }
                });

                let b;

                let region = [];
                this.region.forEach(r=>{
                    if(r.type == 'big') {
                        region = region.concat(r.children);
                    }
                })

                if(region.length == 0) {
                    region = this.region;
                }else{
                    this.region = this.region.concat(region);
                }

                region.forEach((r,index)=>{
                        let geo = r.Geometry;
                        if(geo) {
                            if(index == 0) {
                                b = reader.read(geo);
                            }else{
                                b = b.union(reader.read(geo));
                            }
                        }
                });

                let r = a.intersection(b);
                let area = r.shell.points.coordinates.map(r=>{
                    return [r.x,r.y];
                })

                if(area.length == 0) {
                    return this.$message({
                                  message: "没有相关叠加区域！",
                                  type: 'warning'
                                });
                }

                 this.$emit('check',[
                    {
                            "type":"Feature",
                            "properties": { "name":'叠加区域',"id":1000},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates":[area]
                            }
                        }
                 ])
                this.dialog = false;

            },
            transGeoJSON(list) {
                let str = list.map(l=>{
                    return `${l[0]} ${l[1]}`
                }).join(',');
                return `POLYGON (( ${str} ))`
            },
            onShow() {
                this.canClick = false;
                let checkList = this.$refs.tree.getCheckedNodes();

                checkList = checkList.map(c=>c.id);

                let result = this.source.filter(l=>{
                    return checkList.indexOf(l.id) > -1
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
        components:{
            searchRegion
        },
        mounted(){
           $(this.$el).find('.search-region').slimScroll({ height: document.documentElement.clientHeight - 37 });
            this.getData();
        }
    }
</script>
