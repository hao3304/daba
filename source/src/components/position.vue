<template>
    <div>
        <div id='map-position'>

        </div>
        <p style="text-align:center;">点击地图标记坐标，拖动标记更新坐标</p>
    </div>

</template>
<style lang='less'>
    #map-position{
        height:260px;
    }
</style>
<script>
    import L from 'leaflet';
    import '../components/leaflet.chinese';
    require('leaflet/dist/images/marker-icon-2x.png');
    require('leaflet/dist/images/marker-icon.png');
    require('leaflet/dist/images/marker-shadow.png');

    export default{
        props:['lat','lng','angle','length','border','fill'],
        data(){
            return {
                marker:'',
                polygonLayer:''
            }
        },
        methods:{
            render(){
                if(!this.map){
                     this.map = new L.map('map-position',{
                        center:[38,115],
                        zoom:8,
                        minZoom:2,
                        attributionControl:false,
                    });
                    L.tileLayer.chinaProvider('Google.Satellite.Map',{maxZoom:18,minZoom:2}).addTo(this.map);
                    let scale = new L.Control.Scale().addTo(this.map);

                    this.polygonLayer = new L.featureGroup().addTo(this.map);

                    this.map.on('click',e=>{
                        if(!this.marker){
                            this.addMarker(e.latlng);
                            this.$emit('change',e.latlng);
                        }
                    });
                }

                if(this.lat&&this.lng){
                    this.addMarker([this.lat,this.lng]);
                    this.map.setView([this.lat,this.lng],16);
                }
            },
            addMarker(latlng){
                if(this.marker){
                    this.map.removeLayer(this.marker);
                }
                this.marker = new L.marker(latlng,{draggable:true}).bindTooltip('可以拖动')
                this.marker.addTo(this.map).openTooltip();
                this.marker.on('dragend',e=>{
                    this.drawPolygon();
                    this.lat = e.target._latlng.lat;
                    this.lng = e.target._latlng.lng;
                    this.$emit('change',e.target._latlng);
                })
            },
            drawPolygon(){
                if(this.marker&&this.angle){
                    this.polygonLayer.clearLayers();
                    let width = 0.0009000009000009;
                    let length = 0.003150003150003;
                    if (length < 0.002) length = 0.002;
                    let angle = 360 - this.angle;
                    let x = this.lng;
                    let y = this.lat;

                    let offx0 = (width / 2) * Math.sin(angle * Math.PI / 180.0),
                        offy0 = (width / 2) * Math.cos(angle * Math.PI / 180.0),
                        offy1 = (length / 2) * Math.sin(angle * Math.PI / 180.0),
                        offx1 = (length / 2) * Math.cos(angle * Math.PI / 180.0);

                    let centerx1 = x + offx0;
                    let centery1 = y - offy0;
                    let centerx2 = x - offx0;
                    let centery2 = y + offy0;

                    let x1 = centerx1 + offx1;
                    let y1 = centery1 + offy1;
                    let x2 = centerx1 - offx1;
                    let y2 = centery1 - offy1;

                    let x4 = centerx2 + offx1;
                    let y4 = centery2 + offy1;
                    let x3 = centerx2 - offx1;
                    let y3 = centery2 - offy1;
                    let latlngs = [[y1,x1],[y2,x2],[y3,x3],[y4,x4]];
                    let polygon = new L.polygon(latlngs,{
                        fillColor:this.fill || undefined,
                        color:this.border || undefined
                    }).addTo(this.polygonLayer);


                    let cb = [];
                    latlngs.forEach(ll=>{
                        cb.push(ll[1]+' '+ll[0]);
                    })

                    this.$emit('draw-polygon',cb.join(','));
                }
            }
        },
        watch:{
            angle(){
                this.drawPolygon();
            },
            length(){
                this.drawPolygon();
            },
            fill(){
                this.drawPolygon();
            },
            border(){
                this.drawPolygon();
            },
            lat(){
            this.$nextTick(()=>{
                    this.render();
                });
            }
        },
        mounted(){
              this.$nextTick(()=>{
                    this.render();
              });
        }
    }
</script>
