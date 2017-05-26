<template>
    <div>
        <div class='header'>
            <span class='title'>降雨量分析</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='ranfall' v-loading.body='loading'>

            <div style="text-align:center;">
              <el-row>
                  <el-col style='margin-top:10px' >
                      <el-date-picker
                              size='small'
                              v-model="query.date"
                              type="date"
                              placeholder="选择日期"
                              :picker-options="pickerOptions0"
                      >
                      </el-date-picker>
                  </el-col>
                  <el-col style='margin-top:10px' >
                      <el-select v-model="query.type" size='small' placeholder="请选择">
                          <el-option
                                  key="1"
                                  label="实际"
                                  value="1">
                          </el-option>
                          <el-option
                                  key="2"
                                  label="预测"
                                  value="2">
                          </el-option>
                      </el-select>
                  </el-col>
              </el-row>
                <el-row style='margin-top:10px'>
                    <el-button @click='onSearch' size='small' type='primary' icon='search'>查询</el-button>
                </el-row>
            </div>

            <fieldset style="margin-top:20px;">
                <legend>图例</legend>
                <table class="legend-list" style="width:100%">
                    <tr  v-for='l in legend' v-show='l.PICTURE_TYPE == query.type'>
                        <td>
                            {{l.LEGEND_NAME}}
                        </td>
                        <td>
                             <span :style="{backgroundColor:'rgb('+l.LEGEND_COLOR+')'}" class="legend-color">
                            </span>
                        </td>
                        <td>
                            <a v-show='l.LIST.length>0' href="javascript:;" @click='onShowList(l.LIST)'>[{{l.LIST.length}}]</a>
                        </td>
                    </tr>
                </table>

            </fieldset>
        </div>
    </div>
</template>
<style lang='less'>
    .ranfall{
        padding: 0 10px;
        .legend-list{
            tr{
                td{
                    font-size: 14px;
                }
                line-height: 28px;
                text-align: center;
                .legend-color{
                    display: inline-block;
                    height:24px;
                    vertical-align: middle;
                    width:50px;
                }
            }
        }
    }
</style>
<script>
    import { getAnalyseResult } from '../modules/service.js';

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                legend:[
                        {
                        "ID": "1",
                        "LEGEND_COLOR": "165,241,141",
                        "LEGEND_NAME": "0-10",
                        "PICTURE_TYPE": "1",
                        "LIST":[]
                        },
                        {
                        "ID": "2",
                        "LEGEND_COLOR": "61,184,60",
                        "LEGEND_NAME": "10-25",
                        "PICTURE_TYPE": "1",
                         "LIST":[]
                        },
                        {
                        "ID": "3",
                        "LEGEND_COLOR": "96,183,252",
                        "LEGEND_NAME": "25-50",
                        "PICTURE_TYPE": "1",
                         "LIST":[]
                        },
                        {
                        "ID": "4",
                        "LEGEND_COLOR": "1,1,248",
                        "LEGEND_NAME": "50-100",
                        "PICTURE_TYPE": "1",
                         "LIST":[]
                        },
                        {
                        "ID": "5",
                        "LEGEND_COLOR": "249,0,249",
                        "LEGEND_NAME": "100-250",
                        "PICTURE_TYPE": "1",
                         "LIST":[]
                        },
                        {
                        "ID": "6",
                        "LEGEND_COLOR": "114,0,0",
                        "LEGEND_NAME": ">250",
                        "PICTURE_TYPE": "1",
                         "LIST":[]
                        },
                        {
                        "ID": "7",
                        "LEGEND_COLOR": "165,241,141",
                        "LEGEND_NAME": "0-10",
                        "PICTURE_TYPE": "2",
                         "LIST":[]
                        },
                        {
                        "ID": "8",
                        "LEGEND_COLOR": "61,184,60",
                        "LEGEND_NAME": "10-25",
                        "PICTURE_TYPE": "2",
                         "LIST":[]
                        },
                        {
                        "ID": "9",
                        "LEGEND_COLOR": "96,183,252",
                        "LEGEND_NAME": "25-50",
                        "PICTURE_TYPE": "2",
                         "LIST":[]
                        },
                        {
                        "ID": "10",
                        "LEGEND_COLOR": "1,1,248",
                        "LEGEND_NAME": "50-100",
                        "PICTURE_TYPE": "2",
                         "LIST":[]
                        },
                        {
                        "ID": "11",
                        "LEGEND_COLOR": "249,0,249",
                        "LEGEND_NAME": ">=100",
                        "PICTURE_TYPE": "2",
                         "LIST":[]
                        }
                  ],
                  query:{
                    date:'',
                    type:'1'
                  },
                  loading:false,
                  pickerOptions0: {
                      disabledDate(time) {
                        return time.getTime() >= Date.now() || time.getTime() < Date.now() - 8.64e7*30;
                      }
                    }
            }
        },

        methods:{
            onSearch() {
                this.loading = true;
                this.legend.forEach(l=>{
                    l.LIST = [];
                })
                getAnalyseResult({type:this.query.type,date:this.query.date.Format('yyyy-MM-dd')}).then(rep=>{
                    let data = this.trans(rep);
                    this.$emit('search',data);
                    this.loading = false;
                })
            },
            onClose() {
                 this.$emit('close');
            },
            trans(data) {
                data = JSON.parse(data);
                return data.map(d=>{
                let legend = this.getLegend(d.LEGEND_ID);

                if(d.DAM_IDS) {
                    legend.LIST = legend.LIST.concat(d.DAM_IDS.split(','));
                }

                let color = legend.LEGEND_COLOR;
                    return {
                        color:`rgb(${color})`,
                        area: this.getArea(d.GIS_AREAS)
                    }

                })
            },
            getLegend(id) {
                  return this.legend.find(f=>{
                   return f.ID == id;
                });
            },
            getArea(str) {
                str = str.replace('MULTIPOLYGON(((','').replace(')))','');
                let ll = str.split(',');
                return ll.map(l=>{
                    let latlng = l.split(' ');
                    return [parseFloat(latlng[1]),parseFloat(latlng[0])]
                })
            },
            onShowList(list) {
                let data =  this.dam.list.filter(d=>{
                  return  list.indexOf(d.dbid) > -1;
                })
                this.rightSpan.list = data;
                this.rightSpan.name = '降雨分析';
                this.container.right = true;
            }
        },
        watch:{

        },
        mounted(){
            $(this.$el).find('.ranfall').slimScroll({ height: document.documentElement.clientHeight - 37 });
            this.query.date = new Date();
            this.render();
        }
    }
</script>
