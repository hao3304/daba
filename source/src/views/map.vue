<template>
    <el-row style="height: 100%" :class="{'show-tip':tooltip&&zoom>=8,'small-icon':zoom<8&&zoom>6,'mini-icon':zoom<=6}"  >
        <el-col :span='5' class='main-wrap' v-show='container.left'  >
            <search-form @close='onCloseLeft' v-show='container.left =="search"'></search-form>
            <search-company @close='onCloseLeft' @node-click='flyTo' v-show='container.left =="company"'></search-company>
            <search-river @close='onCloseLeft' v-show='container.left =="river"'></search-river>
            <search-region @close='onCloseLeft' @select='onRegionSelect' v-show='container.left =="region"'></search-region>
            <river-region @close='onCloseRiverRegion' @check='onRegionCheck' v-if='container.left =="river-region"'></river-region>
            <toolbar @toolbar-click="onToolbarClick" @close='onCloseLeft' v-show='container.left =="tool"' class='toolbar'></toolbar>
        </el-col>
        <el-col :span="center_span" class='main-wrap' style="height: 100%;position:relative">
            <div id="map"  style="height: 100%"></div>
            <clegend @change='filterDam' @area-change='onAreaChange' @tooltip-change='onTooltipChange' style="position: absolute;z-index: 1000;right: 10px;top:50px;"></clegend>
            <layers @change='onLayerChange' style="bottom: 10px;right: 10px;"></layers>
            <search></search>
            <login></login>
            <cheader style='position:absolute;z-index:1000;right:10px;top:0;'></cheader>
        </el-col>
        <el-col :span='6'  v-show='container.right' class='main-wrap' >
            <div class='header'>
                <span class='title'>{{rightSpan.name}}</span>
                <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onCloseRight' type="text" icon='circle-close'></el-button>
            </div>
            <el-table :height="height - 30" highlight-current-row @row-click='flyTo'   border class='small-table' :data="currentList"  style="width: 100%">
                <el-table-column
                        label="#"
                        type='index'
                        width='60'
                >   <template  scope="scope">
                    <span>{{scope.$index + (currentPage - 1)*50 +1}}</span>
                </template>
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
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="80"
                        v-if='login.id'
                        inline-template
                >
                    <span>
                        <a href='javascript:;' @click='onEditDb(row)'><i class='el-icon-edit'></i></a>
                        &nbsp;
                        <a href='javascript:;' @click='onDelDb(row)'><i class='el-icon-delete2'></i></a>
                    </span>
                </el-table-column>
            </el-table>
            <div style="text-align:center;">
                <el-pagination
                        small
                        page-size='50'
                        :current-page='currentPage'
                        layout="prev, pager, next"
                        @current-change='onCurrentChange'
                        :total="rightSpan.list.length">
                </el-pagination>
            </div>
        </el-col>

        <el-dialog size='small' v-model='dialog'  >
            <el-form :model="form" label-width="85px" ref='table' :rules='rules'  class='custom-form' >
                <el-row>
                    <el-col :span=12 >
                        <el-form-item label='所在省份'  prop='province'>
                            <el-select placeholder='请先选择省份' size='small' v-model='form.province' :disabled='type=="edit"'>
                                <el-option v-for='p in provinces' :label='p.name' :value='p.name' ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12 v-show='form.province' >
                        <el-form-item label='所在地市'>
                            <el-select placeholder='请选择地市'  size='small' v-model='form.city' >
                                <el-option v-for='c in citys' :lable='c.name' :value='c.name' ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12 v-show='form.province'  >
                        <el-form-item label='选择大坝' prop='dbid' >
                            <el-select placeholder='请选择大坝'  size='small' v-model='form.dbid' v-if='type=="add"' >
                                <el-option v-for='db in selectDB' :label='db.dbmc' :value='db.dbid' ></el-option>
                            </el-select>
                            <span v-else> {{editDbName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12  v-show='form.dbid'>
                        <el-form-item label='所在河流'>
                            <!--<el-cascader-->
                            <!--size='small'-->
                            <!--:show-all-levels="false"-->
                            <!--:options="dam.rivers"-->
                            <!--v-model='selectRiver'-->
                            <!--:props="{value:'id',label:'name',children:'children'}"-->
                            <!--&gt;</el-cascader>-->
                            <itree v-model='form.riverid' :data='dam.rivers'></itree>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-show='form.dbid'>

                    <el-col :span=12  >
                        <el-form-item label='填充颜色'>
                            <el-color-picker  v-model="form.bgColor"></el-color-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12  >
                        <el-form-item label='边框颜色'>
                            <el-color-picker v-model="form.borderColor"></el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show='form.dbid'>
                    <el-col :span=12 >
                        <el-form-item label='大坝角度'>
                            <el-input size='small' type='number' placeholder="请输入大坝角度" v-model='form.angle' ></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span=12 >-->
                    <!--<el-form-item label='大坝长度'>-->
                    <!--<el-input size='small' type='number' placeholder="请输入大坝长度" v-model='form.length' ></el-input>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
                <el-row v-show='form.dbid'>
                    <el-col :span=12 >
                        <el-form-item label='经度' prop='longitude' >
                            <el-input size='small' placeholder='请输入经度'  v-model='form.longitude' type='number' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label='纬度' prop='latitude'  >
                            <el-input size='small' placeholder='请输入纬度' v-model='form.latitude' type='number' ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if='form.dbid' :span='24'>
                    <pos :lat='form.latitude' @draw-polygon='onGetPolygon' @change='onGetPos' :fill='form.bgColor' :border='form.borderColor'  :angle='form.angle' :lng='form.longitude' :length='form.length' ></pos>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click='onSaveDb'>确 定</el-button>
                        <el-button @click.native="dialog = false">取 消</el-button>
                    </span>
        </el-dialog>

        <el-dialog size='tiny' v-model='around_dialog'>
            <el-form :model='around_form' label-width='60px' :rules='rules2' ref='around-form' >
                <el-row>
                    <el-col :span=24 >
                        <el-form-item label='经度' prop='lng'>
                            <el-input type='number' placehoder='请输入经度' v-model='around_form.lng' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24 >
                        <el-form-item label='纬度' prop='lat'>
                            <el-input type='number' placehoder='请输入纬度' v-model='around_form.lat' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24 >
                        <el-form-item label='距离' prop='distance'>
                            <el-input type='number' placehoder='请输入距离' v-model.number='around_form.distance' >
                                <template slot="append">千米</template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click='onSearchAround'>查 询</el-button>
                        <el-button @click.native="around_dialog = false">取 消</el-button>
                    </span>
        </el-dialog>
    </el-row>
</template>
<style lang='less'>

    .custom-popup{
        .leaflet-popup-content{
            margin: 5px;
        }
    }

    .marker-hover{
        img{
            transform: scale(1) !important;
        }
    }
    .custom-form{
        .el-form-item{
            margin-bottom: 4px !important;
        }
    }
    .small-icon{
        .my-div-icon{
            img{
                transform: scale(0.8);
            }
        }
    }
    .mini-icon{
        .my-div-icon{
            img{
                transform: scale(0.6);
            }
        }
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

    .show-tip{
        .my-div-icon{
            .tag{
                display: block;
            }
        }
    }

    .my-div-icon{
        .tag{
            position: absolute;
            left: 14px;
            top: -10px;
            white-space: nowrap;
            background-color: rgba(255,255,255,.9);
            padding: 6px;
            background-color: #fff;
            border: 1px solid #fff;
            border-radius: 3px;
            color: #222;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
            box-shadow: 0 1px 3px rgba(0,0,0,.4);
            display: none;

            &:before{
                content:' ';
                width:0;
                height:0;
                border-top:5px solid transparent;
                border-bottom:5px solid transparent;
                border-right:5px solid #fff;
                position: absolute;
                left: -6px;
                top: 10px;
            }
        }
    }

</style>
<script>
    import L from 'leaflet';
    import '../components/leaflet.chinese';
    import { getDma,setDbPosition,delDam,getDbList,getRivers } from '../modules/service';
    window.Spinner = require('spin');
    require('leaflet-spin')(L);
    import '../components/zoomhome';
    import 'leaflet-editable';
    import 'leaflet-measure-path';
    import 'leaflet-contextmenu';
    import 'leaflet.markercluster';
    import toolbar from '../components/toolbar.vue';
    import clegend from '../components/legend.vue';
    import layers from '../components/layers.vue';
    import searchForm from '../components/searchForm.vue';
    import searchCompany from '../components/searchCompany.vue';
    import searchRegion from '../components/searchRegion.vue';
    import searchRiver from '../components/searchRiver.vue';
    import riverRegion from '../components/searchRiverRegion.vue';
    import search from '../components/search.vue';
    import login from '../components/login.vue';
    import cheader from '../components/header.vue';
    import pos from '../components/position.vue';
    import itree from '../components/itree.vue';
    import pip from '@mapbox/leaflet-pip';

    require('leaflet.markercluster/dist/MarkerCluster.Default.css');

    import {province,city} from '../modules/province';

    function model(){
        return {
            dbid:'',
            province:'',
            city:'',
            longitude:'',
            latitude:'',
            bgColor:'',
            borderColor:'',
            riverid:'',
            angle:'',
            area:'',
            length:''
        }
    }


    export default{
        store:['dam','layer','rightSpan','search','container','login','addList','_map'],
        data() {
            return {
                height: document.documentElement.clientHeight - 40,
                zoom:4,
                center:[38,115],
                minZoom:2,
                tooltip:false,
                list:[],
                dialog:false,
                editDbName:'',
                type:'add',
                form:model(),
                provinces:province,
                rules:{
                    province:[
                        {required:true,message:'请选择所属省份',trigger:'blur'}
                    ],
                    dbid:[
                        {required:true,message:'请选择大坝',trigger:'blur'}
                    ],
                    longitude:[
                        {required:true,message:'请输入经度',trigger:'blur',type:'number'}
                    ],
                    latitude:[
                        {required:true,message:'请输入纬度',trigger:'blur',type:'number'}
                    ]
                },
                rules2:{
                    lat:[
                         {required:true,message:'请输入纬度',trigger:'blur',type:'number'}
                    ],
                    lng:[
                        {required:true,message:'请输入经度',trigger:'blur',type:'number'}
                    ],
                    distance:[
                        {required:true,message:'请输入距离',trigger:'blur',type:'number'}
                    ]
                },
                around_dialog:false,
                around_form:{
                    lng:null,
                    lat:null,
                    distance:null
                },
                currentPage:1
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

            },
            citys(){
                let pid,result = [];
                this.provinces.forEach((p)=>{
                    if(p.name == this.form.province){
                        pid = p.ProID;
                    }
                });
                if(pid){
                    city.forEach((c)=>{
                        if(c.ProID == pid){
                            result.push(c);
                        }
                    })
                    return result;
                }else{
                    return [];
                }
            },
            selectDB(){
                return this.addList.filter(db=>{
                    return db.sf == this.form.province && db.isplaced == 0
                })
            },
            currentList() {
                return this.rightSpan.list.slice((this.currentPage-1)*50,this.currentPage*50);
            }
        },
        methods:{
            renderMap(){
                this.map = new L.map('map',{
                    center:this.center,
                    zoom:this.zoom,
                    minZoom:this.minZoom,
                    attributionControl:false,
                    zoomControl:false,
                    editable:true,
                    contextmenu: true,
                    contextmenuWidth: 140,
                    contextmenuItems: [
                    {
                        text: '周边查询',
                        callback:(e)=>{
                            this.around_form = {
                                ...{lat:e.latlng.lat,
                                lng:e.latlng.lng}
                            }
                            this.around_dialog = true;
                        }
                    },
                    {
                        text: '放大',
                        callback:()=>{
                            this.map.zoomIn();
                        }
                    },{
                        text: '缩小',
                        callback:()=>{
                            this.map.zoomOut();
                        }
                    }
                    ]
                });

                L.control.zoom({position:'bottomleft'}).addTo(this.map);
                L.control.zoomhome({position:'topleft'}).addTo(this.map);

                this.normal = L.tileLayer.chinaProvider('Google.Normal.Map',{maxZoom:18,minZoom:2}).addTo(this.map);
                this.earth =new L.layerGroup();
                L.tileLayer.chinaProvider('Google.Satellite.Map',{maxZoom:18,minZoom:2}).addTo(this.earth);

               /* var wmsLayer = L.tileLayer.wms('http://183.247.147.228:8006/geoserver/nyc/wms?', {
                    layers:'nyc:region_dam',
                    crs:L.CRS.EPSG4326,
                    format:'image/png'
                }).addTo(this.map); */

                this.markerLayers = new L.featureGroup().addTo(this.map);
                this.measureLayers = new L.featureGroup().addTo(this.map);
                this.regionLayers = new L.featureGroup().addTo(this.map);

                //流域图层
                let self = this;
                this.riverRegionLayers = new L.geoJson([],{
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.name);
                    },
                      style: function (feature) {
                        return {color: self.getRandomColor()};
                    },
                }).addTo(this.map);
                //大坝区域
                this.areaLayers = new L.featureGroup();
                this.map.on('zoomend',(m)=>{
                    this.zoom = m.target._zoom;
                })

                this.map.spin(true);
                this.getDamList();
                this._map = this.map;
            },
            renderMarkers(rep){
                this.markerLayers.clearLayers();
                this.areaLayers.clearLayers();
                rep.forEach((m)=>{
                    this.addMarker(m);
                });
                this.map.spin(false);
            },
            addMarker(m){
                if(typeof m.isShow  =='boolean'&& !m.isShow){
                        return;
                    }

                    let lat = parseFloat(m.latitude),
                        lng = parseFloat(m.longitude);
                    if(lat&&lng){
                        //let icon = new L.icon({iconUrl:m.iconPath,iconSize:[parseInt(m.iconWidth),parseInt(m.iconHeight)]})
                        let icon = L.divIcon({className:"my-div-icon",html:`<img src="${m.iconPath}" style="width:${m.iconWidth}px;height:${m.iconHeight}px;margin-left:-${m.iconWidth/4}px;margin-top:-${m.iconHeight/4}px"><span class='tag'>${m.dbmc}</span>`});
                        let marker = new L.marker([lat,lng],{
                        icon:icon,
                        name:m.dbmc,
                        dbid:m.dbid,
                        ...m,
                        contextmenu: !!this.login.id,
                        contextmenuInheritItems:false,
                        contextmenuItems: [{
                            text: '编辑大坝',
                            index: 0,
                            callback:(e)=>{
                                this.onEditDb(e.relatedTarget.options)
                            }
                        }, {
                            text: '删除大坝',
                            index: 1,
                            callback:(e)=>{
                                this.onDelDb(e.relatedTarget.options,e);
                            }
                        }]

                        }).addTo(this.markerLayers);
                        marker.bindPopup('<iframe src="/detail.html?id='+m.dbid+'" style="border:none;width:360px;height:300px;" ></iframe>',{maxWidth:352,className:'custom-popup',minHeight:300});

                        marker.on('mouseover',(m)=>{
                            $(m.target._icon).addClass('marker-hover');


                            if(!this.tooltip){
                                 m.target.bindTooltip(m.target.options.name,{direction:'top',offset:[0,-10]});
                                 m.target.openTooltip();
                            }
                        }).on('mouseout',(m)=>{
                           $(m.target._icon).removeClass('marker-hover');
                            m.target.unbindTooltip();
                        });

                        if(m.area){
                            let latlngs = this._getGeo(m.area,',');
                            let polygon = new L.polygon(latlngs,{fillColor:m.bgColor,color:m.borderColor,weight:2,dbid:m.dbid});
                            polygon.addTo(this.areaLayers);
                        }
                    }
            },
            getRandomColor(){
               return '#'+Math.floor(Math.random()*16777215).toString(16);
            },
            getDamList(){
                 getDma().then((rep)=>{
                        this.list = rep;
                        this.dam.list = rep;
                        this.renderMarkers(this.list);
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
                 this.tooltip = b;
                 if(b){
                    this.map.setZoom(8);
                 }
            },
            filterDam(){
                this.map.spin(true);
                let list = this.list.filter((l)=>{
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
                    if(!b){
                        return b;
                    }

                    l.isShow = this.layer.legend.indexOf(l.kind)>-1;
                    return b;

                });
                this.dam.list = list;
                setTimeout(()=>this.renderMarkers(list),100);

            },
            flyTo({dbid}){
                this.markerLayers.eachLayer((layer)=>{
                    if(layer.options.dbid == dbid){
                       return this.map.setView(layer._latlng,16);
                    }
                })
            },
            delMarker(dbid){
                this.markerLayers.eachLayer((layer)=>{
                    if(layer.options.dbid == dbid){
                       return this.markerLayers.removeLayer(layer);
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
            },
            onRegionSelect(region){
                this.regionLayers.clearLayers();
                region.forEach((r)=>{
                    if(r.Geometry){
                        let polygon = new L.polygon(this._getGeo(r.Geometry),{fillColor:r.Color||this.getRandomColor(),weight:2});
                        polygon.bindPopup(r.RegionName);
                        polygon.addTo(this.regionLayers);
                    }
                });
                let bounds = this.regionLayers.getBounds();
                if(bounds._northEast){
                        this.map.fitBounds(bounds);
                }
            },
            _getGeo(str,split){
                let result = [];
                str = str.replace('POLYGON ((','').replace('))','');
                let list = str.split(split?split:', ');
                list.forEach((l)=>{
                    let latlng = l.split(' ');
                    let lat = parseFloat(latlng[1]);
                    let lng = parseFloat(latlng[0]);
                    if(lat&&lng){
                        result.push([lat,lng]);
                    }
                });
                return result;
            },
            onAddDb(e){
                this.dialog = true;
                this.form = {...model()};
                if(this.$refs.table&&this.$refs.table.retFields){
                    this.$refs.table.retFields();
                }
                this.type = 'add';
                this.form.longitude = e.latlng.lng;
                this.form.latitude = e.latlng.lat;
            },
            onDelDb(options,e){
                let dbid = options.dbid;
                let name = options.name;
                if(dbid){
                    layer.open({
                        title:'提示',
                        icon:8,
                        content:`是否删除该大坝（${name}）?`,
                        btn:['确定','取消'],
                        yes:()=>{
                            layer.load(1);
                             delDam(dbid).then(rep=>{
                                let result = eval(rep);
                                    layer.closeAll();
                                    this.$message({
                                      type: result?'success':'error',
                                      message: result?'删除成功！':'删除失败！'
                                    });
                                    this.markerLayers.removeLayer(e.relatedTarget);
                                    this.areaLayers.eachLayer(layer=>{
                                        if(layer.options.dbid == dbid){
                                            this.areaLayers.removeLayer(layer);
                                        }
                                    })
                                   // this.init();
                             })
                        }
                    })
                }
            },
            onSaveDb(){
                this.$refs.table.validate(valid=>{
                    if(valid){
                        layer.load(1);
                        setDbPosition(this.form).then(rep=>{
                            layer.closeAll();
                            this.dialog = false;
                            if(eval(rep)){
                                this.$message({
                                  type: 'success',
                                  message: '提交成功！'
                                });
                                this.delMarker(this.form.dbid);
                                this.map.spin(true);
                                getDma({dbid:this.form.dbid}).then(rep=>{
                                    this.map.spin(false);
                                    let result = rep[0];
                                    this.list.push(result);
                                    this.dam.list.push(result);
                                    this.addMarker(result);
                                   // this.init();
                                })
                            }
                        })
                    }
                })
            },
            onEditDb(d){
                this.form = {...{
                    dbid:d.dbid,
                    province:d.province,
                    city:d.city,
                    longitude:parseFloat(d.longitude),
                    latitude:parseFloat(d.latitude),
                    bgColor:'',
                    borderColor:'',
                    riverid:d.riverid,
                    angle:d.angle,
                    area:d.area,
                    length:''
                }}
                this.type = 'edit';
                this.editDbName = d.name || d.dbmc;
                if(this.$refs.table&&this.$refs.table.retFields){
                    this.$refs.table.retFields();
                }
                this.dialog = true;
            },
            onGetPos(position){
                this.form.longitude = position.lng;
                this.form.latitude = position.lat;
            },
            onGetPolygon(area){
                this.form.area = area;
            },
            init(){
                getDbList().then(rep=>{
                    this.addList = JSON.parse(rep);
                })
            },
            onSearchAround(){
                this.$refs['around-form'].validate(valid => {
                    if(valid) {
                        let list = [];
                        this.dam.list.forEach(marker => {
                                let lat = marker.latitude,
                                    lng = marker.longitude;
                                    if(lat&&lng) {
                                        let distance = this.map.distance([this.around_form.lat,this.around_form.lng],[parseFloat(lat),parseFloat(lng)])

                                        if(distance/1000 < this.around_form.distance) {
                                            list.push(marker);
                                        }
                                    }
                        })

                            this.rightSpan.list = list;
                            this.rightSpan.name = '周边查询结果';
                            this.container.right = true;
                            this.around_dialog = false;

                    }
                })
            },
            onAreaChange(v) {
                if(v){
                    this.regionLayers.addTo(this.map);
                }else{
                    this.map.removeLayer(this.regionLayers);
                }
            },
            onManageDb() {
            
            },
            onCurrentChange(p) {
                this.currentPage = p;
            },
            onRegionCheck(checked) {
                this.regionCheck = true;
                this.map.spin(true);
                setTimeout(()=>{
                     this.riverRegionLayers.clearLayers();
                if(checked.length>0) {
                    checked.forEach(c=>{
                        this.riverRegionLayers.addData(c);
                    })
                    this.map.fitBounds(this.riverRegionLayers.getBounds());
                    this.map.removeLayer(this.normal);
                    this.map.removeLayer(this.earth);

                    let markers = this.dam.list.filter(l=>{
                         if(l.longitude&&l.latitude) {
                            let b = pip.pointInLayer([parseFloat(l.longitude),parseFloat(l.latitude)],this.riverRegionLayers);
                            return b.length>0
                         }else{
                            return false
                         }
                    })

                    this.renderMarkers(markers);
                }else{
                    this.renderMarkers([]);
                }
                },100)
            },
            onCloseRiverRegion() {
                this.onCloseLeft();
                if(this.regionCheck) {
                    this.map.spin(true);
                    this.normal.addTo(this.map);

                    setTimeout(()=>{
                        this.riverRegionLayers.clearLayers();
                        this.renderMarkers(this.dam.list);
                    },100)
                }
            }

        },
        watch:{
            container:{
               deep:true,
               handler(){
                 this.$nextTick(()=>this.map.invalidateSize());
               }
            },
            'container.left'(a,b){
                if(b == 'river-region'){
                    this.onCloseRiverRegion();
                }
            },
            search(v){
                this.flyTo(v);
            },
            'rightSpan.list'(){
                this.currentPage = 1;
            },
            zoom(z){
                if(z >= 12){
                    this.areaLayers.addTo(this.map);
                }else{
                    this.map.removeLayer(this.areaLayers);
                }
            },
            'login.id'(id){
                if(id){
                    this.map.contextmenu.insertItem({
                    text:'添加大坝',
                    callback:this.onAddDb
                    },0)
                     this.map.contextmenu.insertItem({
                    text:'大坝管理',
                    callback:()=>{
                        this.rightSpan.list = this.dam.list;
                        this.rightSpan.name = '大坝管理';
                        this.container.right = true;
                    }
                    },2)
                    this.map.contextmenu.insertItem('-',3);

                    this.markerLayers.eachLayer(marker=>{
                        marker.options.contextmenuItems =  [{
                            text: '编辑大坝',
                            index: 0,
                            callback:this.onEditDb
                        }, {
                            text: '删除大坝',
                            index: 1,
                            callback:this.onDelDb
                        }]
                    })

                }
            }
        },
        components:{
            toolbar,
            clegend,
            layers,
            searchForm,
            searchCompany,
            searchRegion,
            searchRiver,
            login,
            search,
            cheader,
            pos,
            itree,
            riverRegion
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

             this.init();
        }
    }
</script>
