<template>
    <div>
        <div class='header'>
            <span class='title'>自定义剖面</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div class="section" v-loading.body='loading'>
            <el-table :data='data' :highlight-current-row='true'>
                <el-table-column label='名称' prop='name'></el-table-column>
                <el-table-column inline-template label='操作'>
                    <div>
                        <el-button type='text' @click='onShowSection(row)' icon='search'>
                        </el-button>
                        <el-button type='text' icon='edit' @click='onEditSection(row)'>
                        </el-button>
                        <el-button type='text' icon='delete' @click='onDelSection(row)'></el-button>
                    </div>
                </el-table-column>
            </el-table>

            <div style="padding:5px;">
                <el-button icon='plus' @click='onAdd' type='primary' size='small' style='width:100%;'>新增</el-button>
            </div>
        </div>

        <el-dialog size='large' top='5%' :visible='dialog' :before-close='onCloseDialog' :title='title' style='text-align:center;'>
            <iframe v-if='dialog' style="border:none;height:420px;width:100%;" :src="'/profile.html?ids='+ids"></iframe>
        </el-dialog>
        <el-dialog size='large' top='5%' :visible='sectionDialog' :before-close='onCloseDialog' :title='dialogTitle' >
            <el-row>
                <el-input placeholder='请输入名称' v-model='name'></el-input>
            </el-row>
            <el-row style='margin-top:10px;'>
                <el-col :span='11'>
                    <fieldset>
                        <legend>请选择大坝</legend>
                        <el-input
                                placeholder="请输入大坝名称查询"
                                v-model="search"
                        >
                        </el-input>
                        <el-table :height='270'
                                  :data='dmaList'
                                  :highlight-current-row='true'
                                  @row-click='onSelectRow'
                        >
                            <<el-table-column
                                label="#"
                                type='index'
                                width='60'
                        >   <template  scope="scope">
                            <span>{{scope.$index + (query.page - 1)*query.size +1}}</span>
                        </template>
                        </el-table-column>
                            <el-table-column label='名称' prop='dbmc'></el-table-column>
                            <el-table-column label='坝高(米)' prop='height'></el-table-column>
                        </el-table>
                        <div style="text-align:center;">
                            <el-pagination
                                    layout="prev, pager, next"
                                    :page-size='query.size'
                                    @current-change='onCurrentChange'
                                    :total="dam.list.length">
                            </el-pagination>
                        </div>
                    </fieldset>

                </el-col>
                <el-col :span='2' style='text-align:center;padding-top:200px;'>
                    >>
                </el-col>
                <el-col :span='11'>
                    <fieldset>
                        <legend>已选择大坝</legend>
                        <el-table :height='338' :data='selectList'>
                            <el-table-column label='序号' type='index' width='65px'></el-table-column>
                            <el-table-column label='名称' prop='dbmc'></el-table-column>
                            <el-table-column label='操作' type='index' inline-template >
                                <el-button icon='delete' @click='onRemove(row)' type='text'></el-button>
                            </el-table-column>
                        </el-table>
                    </fieldset>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button @click="sectionDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang='less'>

</style>
<script>
    import { addSection,getSectionList,updateSection,deleteSection } from '../modules/service.js';

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                loading: false,
                data:[],
                dialog:false,
                title:'',
                name:'',
                ids:'',
                id:'',
                sectionDialog:false,
                query:{
                    page:1,
                    size:20
                },
                search:'',
                selectList:[],
                dialogTitle:'新增剖面'
            }
        },
        computed: {
            dmaList() {
                let dams = this.dam.list;
                if(this.search) {
                    dams = dams.filter(d=>{
                        return d.dbmc.indexOf(this.search) > -1;
                    })
                }
                return dams.slice((this.query.page-1)*this.query.size, this.query.page * this.query.size );
            }
        },
        methods:{
            render() {
                this.loading = true;
                getSectionList().then(rep=>{
                        this.data = JSON.parse(rep);
                      this.loading = false;
                })
            },
            onClose() {
                this.$emit('close');
            },
            onShowSection(row) {
                this.ids = row.damIds;
                this.title = row.name;
                this.dialog = true;
                this.dialogTitle = '新增剖面'
            },
            onEditSection(data) {
                this.sectionDialog = true;
                this.name = data.name;
                this.id = data.id;
                let ids = data.damIds.split(',');
                let nms = data.damNames.split(',');

                this.selectList = ids.map((id,index)=>{
                    return {
                        dbid:id,
                        dbmc:nms[index]
                    }
                })

                this.dialogTitle = '编辑剖面';

            },
            onDelSection(row) {
                this.$confirm('此操作将永久删除该剖面, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    deleteSection({id:row.id}).then(rep=>{
                     this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      this.render();
                    })
                }).catch(() => {

                });
            },
            onCloseDialog() {
                this.dialog = false;
                this.sectionDialog = false;
            },
            onAdd() {
                this.name = '';
                this.id = '';
                this.selectList = [];
                this.sectionDialog = true;
            },
            onCurrentChange(page) {
                this.query.page = page;
            },
            onSelectRow(row) {
                if((this.selectList.filter(s=>s.dbid==row.dbid)).length==0) {
                     this.selectList.push(row);
                }
            },
            onRemove(row) {
                let index = this.selectList.findIndex(d=>d.dbid==row.dbid);
                this.selectList.splice(index,1)
            },
            onSubmit() {
                if(!this.name) {
                    return this.$message({
                          showClose: true,
                          message: '请填写剖面名称',
                          type: 'warning'
                        });
                }

                 if(this.selectList.length == 0) {
                    return this.$message({
                          showClose: true,
                          message: '请选择大坝',
                          type: 'warning'
                        });
                }

                let ids = this.selectList.map(s=>s.dbid);
                this.sectionDialog = false;

                if(this.id) {

                    updateSection({
                        id:this.id,
                        name:this.name,
                        damIds: ids.join(',')
                        }).then(rep=>{
                            this.$message({
                              showClose: true,
                              message: '更新成功',
                              type: 'success'
                            })
                        this.render();
                    })

                }else {
                       addSection({
                        name:this.name,
                        damIds: ids.join(',')
                        }).then(rep=>{
                            this.$message({
                              showClose: true,
                              message: '提交成功',
                              type: 'success'
                            })
                        this.render();
                    })

                }



            }
        },
        mounted(){
            this.render();
            $(this.$el).find('.section').slimScroll({ height: document.documentElement.clientHeight - 37 });
        }
    }
</script>
