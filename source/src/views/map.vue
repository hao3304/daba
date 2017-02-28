<template>
    <el-row style="height: 100%"  >
        <el-col :span='5' class='main-wrap' v-show='container.left'  >
            <search-form @close='onCloseLeft' v-show='container.left =="search"'></search-form>
            <search-company @close='onCloseLeft' @node-click='flyTo' v-show='container.left =="company"'></search-company>
        </el-col>
        <el-col :span="center_span" class='main-wrap' style="height: 100%;position:relative">
            <div id="map"  style="height: 100%"></div>
            <toolbar @toolbar-click="onToolbarClick" class='toolbar'></toolbar>
            <clegend @change='filterDam' @tooltip-change='onTooltipChange' style="position: absolute;z-index: 1000;right: 10px;top:10px;"></clegend>
            <layer @change='onLayerChange' style="bottom: 10px;right: 10px;"></layer>
            <login></login>
        </el-col>
        <el-col :span='6'  v-show='container.right' class='main-wrap' >
            <div class='header'>
                <span class='title'>{{rightSpan.name}}</span>
                <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onCloseRight' type="text" icon='circle-close'></el-button>
            </div>
            <el-table :height="height" highlight-current-row @row-click='flyTo'   border class='small-table' :data="rightSpan.list"  style="width: 100%">
                <el-table-column
                        type='index'
                        label="#"
                        width='60'
                       >
                </el-table-column>
                <el-table-column
                        label="名称"
                        prop='dbmc'
                >
                </el-table-column>
                <el-table-column
                        label="省份"
                        prop='province'
                        :filters='filters'
                        :filter-method="filterTag"
                >
                </el-table-column>
                <el-table-column
                        label="坝高"
                        prop='height'
                >
                </el-table-column>
                <el-table-column
                        label="装机"
                        prop='capacity'
                >
                </el-table-column>
                <el-table-column
                        label="库容"
                        prop='storage'
                >
                </el-table-column>
                <el-table-column
                        label="监管"
                        prop='constructState'
                >
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<style lang='less'>
    .leaflet-marker-draggable{
        width: 10px !important;
        height: 10px !important;;
        margin-top: -5px !important;;
        margin-left: -5px !important;
    }
    .custom-popup{
        .leaflet-popup-content{
            margin: 5px;
        }
    }

    .toolbar{
        position: fixed;top:11px;right:140px;z-index: 1000;
    }

    @media screen and (max-width:940px){
        .toolbar{
            top: 57px;
            right: 45px;
        }
    }


    .small-table.el-table{
        td,th{
            height: 32px;
        }
        .cell{
            font-size: 12px;
            line-height: 22px;
        }

    }
    .header{
        background-color:#eef1f6;
        color:#20a0ff;
        line-height:36px;
        padding:0 10px;
        span{
            font-size:14px;
        }
    }
</style>
<script>
    import L from 'leaflet';
    import 'leaflet.chinesetmsproviders';
    import { getDma } from '../modules/service';
    window.Spinner = require('spin');
    require('leaflet-spin')(L);
    import '../components/zoomhome';
    import 'leaflet-editable';
    import 'leaflet-measure-path';
    import 'leaflet.markercluster';
    import toolbar from '../components/toolbar.vue';
    import clegend from '../components/legend.vue';
    import layer from '../components/layers.vue';
    import searchForm from '../components/searchForm.vue';
    import searchCompany from '../components/searchCompany.vue';
    import login from '../components/login.vue';
    require('leaflet.markercluster/dist/MarkerCluster.Default.css');


    export default{
        store:['dam','layer','rightSpan','search','container'],
        data() {
            return {
                height: document.documentElement.clientHeight - 88
            }
        },
        computed:{
            center_span(){
                let span = 24;
                if(this.container.left){
                    span = span - 5;
                }
                if(this.container.right){
                    span = span - 6;
                }

                return span;
            },
            filters(){
                var pros = {};
                this.rightSpan.list.forEach((l)=>{
                   pros[l.province] = 0;
                });
                return Object.keys(pros).map((name)=>{
                    return {text:name,value:name};
                });

            }
        },
        methods:{
            renderMap(){
                this.map = new L.map('map',{
                    center:[30,120],
                    zoom:6,
                    attributionControl:false,
                    zoomControl:false,
                    editable:true
                });
                L.control.zoom({position:'bottomleft'}).addTo(this.map);
                //L.control.scale().addTo(this.map);
                L.control.zoomhome({position:'topleft'}).addTo(this.map);

                this.normal = L.tileLayer.chinaProvider('GaoDe.Normal.Map',{maxZoom:18,minZoom:2}).addTo(this.map);
                this.earth =new L.layerGroup();
                L.tileLayer.chinaProvider('GaoDe.Satellite.Map',{maxZoom:18,minZoom:2}).addTo(this.earth);
                L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion',{maxZoom:18,minZoom:2}).addTo(this.earth);

                this.markerLayers = new L.markerClusterGroup().addTo(this.map);
                this.measureLayers = new L.featureGroup().addTo(this.map);

                this.map.spin(true);
                this.getDamList();
            },
            renderMarkers(rep){
                this.markerLayers.clearLayers();
                rep.forEach((m)=>{
                    let lat = parseFloat(m.latitude),
                        lng = parseFloat(m.longitude);
                    if(lat&&lng){
                        let icon = new L.icon({iconUrl:m.iconPath,iconSize:[parseInt(m.iconWidth),parseInt(m.iconHeight)]})

                        let marker = new L.marker([lat,lng],{icon:icon,name:m.dbmc,dbid:m.dbid}).addTo(this.markerLayers);
                        marker.bindPopup('<iframe src="/detail.html?id='+m.dbid+'" style="border:none;width:352px;height:300px;" ></iframe>',{maxWidth:352,className:'custom-popup',minHeight:300});

                    }
                });
                this.map.spin(false);
            },
            getDamList(){
                 getDma().then((rep)=>{
                    this.dam.list = rep;
                    this.renderMarkers(rep);
                 });
            },
            onToolbarClick(type){
                switch (type){
                    case 'measure-line':
                    case 'measure-polygon':
                        let feature = type=='measure-line'?this.map.editTools.startPolyline():this.map.editTools.startPolygon();
                        feature.addTo(this.measureLayers);
                        feature.on('editable:drawing:move editable:vertex:drag',()=>{
                            feature.showMeasurements();
                            feature.updateMeasurements();
                        });
                        feature.on('editable:drawing:commit',()=>{
                            feature.showMeasurements();
                            feature.updateMeasurements();
                            feature.disableEdit();
                        });
                        break;
                    case 'clear':
                        this.measureLayers.clearLayers();
                        break;
                    case 'Polyline':
                    case 'Polygon':
                    case 'Circle':
                    case 'Rectangle':
                        this.map.editTools[`start${type}`]().addTo(this.measureLayers);

                }
            },
            onLayerChange(type){
                this.map.removeLayer(this.earth);
                this.map.removeLayer(this.normal);
                this[type].addTo(this.map);
            },
            onTooltipChange(b){
            this.map.spin(true);
                setTimeout(()=>{
                this.markerLayers.eachLayer((layer)=>{
                    if(b){
                        layer.bindTooltip(layer.options.name,{permanent:true});
                    }else{
                    layer.unbindTooltip();
                    }
                })
                this.map.spin(false);
                },200)
            },
            filterDam(){
                this.map.spin(true);
                let list = this.dam.list.filter((l)=>{
                     let b = true;
                     b = this.layer.state.indexOf(l.isGisConfirm)>-1;
                    if(!b){
                        return b;
                    }
                    switch(this.layer.mode){
                        case '全国':{
                         b = true;
                        }break;
                        case '水利':
                        case '电力':
                         b = l.domination == this.layer.mode;
                         break;
                         default:
                         b = (l.domination !='电力'&& l.domination!='水利');
                    }
                    b = this.layer.legend.indexOf(l.kind)>-1;
                    return b;

                });
                setTimeout(()=>this.renderMarkers(list),100);

            },
            flyTo({dbid}){
                this.markerLayers.eachLayer((layer)=>{
                    if(layer.options.dbid == dbid){
                       return this.map.flyTo(layer._latlng,16);
                    }
                })
            },
            onCloseRight(){
                this.container.right = false;
                this.rightSpan.list = [];
            },
            onCloseLeft(){
                this.container.left = false;
            },
            filterTag(value,row){
                return row.province == value;
            }
        },
        watch:{
            container:{
               deep:true,
               handler(){
                 this.$nextTick(()=>this.map.invalidateSize());
               }
            },
            search(v){
                this.flyTo(v);
            }
        },
        components:{
            toolbar,
            clegend,
            layer,
            searchForm,
            searchCompany,
            login
        },
        mounted() {
            this.$nextTick(()=>{
                this.$nextTick(()=>{
                    this.renderMap();
                    $('.leaflet-touch').removeClass('leaflet-touch');
                })
            })

             $(window).resize(()=>{
                this.height = document.documentElement.clientHeight - 88;
             });
        }
    }
</script>
