<template>
    <div>
        <div class='header'>
            <span class='title'>应急管理</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='emergency' v-loading.body='loading'>
            <el-tabs v-model="tab" >
                <el-tab-pane label="地震" name="地震">
                    <el-table @row-click='onDzClick' :height.number='height' :data='dz' style='width:100%'>
                        <el-table-column width='150px' label='时间' prop='time' ></el-table-column>
                        <el-table-column  width='140px' label='参考地点' prop='addr' ></el-table-column>
                        <el-table-column  label='深度' prop='deep' ></el-table-column>
                        <el-table-column  label='震级' prop='level' ></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="台风" name="台风">
                    <el-table @row-click='onTfClick' :height.number='height' :data='tf'>
                        <el-table-column label='时间' prop='time' ></el-table-column>
                        <el-table-column label='编号' prop='no' ></el-table-column>
                        <el-table-column label='名称' prop='name' ></el-table-column>
                        <el-table-column width='200px' label='登录信息' prop='info' ></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import { getEmergency,getAccidentInfo } from '../modules/service.js';

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                tab:'地震',
                loading:true,
                dz:[],
                tf:[],
                height:document.documentElement.clientHeight - 100
            }
        },

        methods:{
            render(){
                this.getList(this.tab);
            },
            getList(type) {
               let p = this.tab == '地震'?'540101101':'540101108';

               getEmergency({type:p}).then(rep=>{
                    rep=JSON.parse(rep);
                    let data =  rep.tabList[0].infos;
                    if(this.tab == '地震'){
                        this.dz = data.map(d=>{
                            return {
                                time:d[0],
                                addr:d[1],
                                deep:d[2],
                                level:d[3],
                                lat:parseFloat(d[4]),
                                lng:parseFloat(d[5]),
                                id:d[7]
                            }
                        })
                    }else{
                        this.tf = data.map(d=>{
                            return {
                                time:d[0],
                                no:d[1],
                                name:d[2],
                                info:d[3],
                                id:d[4]
                            }
                        })
                    }
                    this.loading = false;
                })
            },
            onClose(){
                this.rightSpan.list = [];
                this.rightSpan.name = '';
                this.container.right = false;
                this.$emit('close');
            },
            onDzClick(row) {
                this.$emit('click','地震',row);
                this.getAccident(row,'地震');
            },
            onTfClick(row) {
                this.getAccident(row,'台风');
            },
            getAccident(data,type) {
                this.loading = true;
                getAccidentInfo({
                    type:'effectedDamList',
                    emergencyId:data.id
                }).then(rep=>{
                    this.loading = false;
                    rep=JSON.parse(rep);
                    let data = this.getDam(rep.tabList[0].infos);

                    this.rightSpan.list = data;
                    this.rightSpan.name = '受影响范围';
                    this.container.right = true;

                })
            },
            getDam(data) {
                if(data.length>0) {
                    return this.dam.list.filter(d=>{
                        let b = false;
                        data.forEach(t=>{
                               if(d.dbid == t[5]){
                                    b = true;
                               }
                        })
                        return b;
                    })
                }else{
                    return [];
                }


            }
        },
        watch:{
            tab(t){

                if(this.tf.length>0&&this.dz.length>0){
                    return;
                }

                this.getList(t);
            }
        },
        mounted(){
            this.render();
            $(this.$el).find('.emergency').slimScroll({ height: document.documentElement.clientHeight - 37 });
        }
    }
</script>
