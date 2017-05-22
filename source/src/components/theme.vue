<template>
    <div>
        <div class='header'>
            <span class='title'>专题图</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='theme' v-loading.body='loading'>

            <el-table :data=data >
                <el-table-column prop='NAME' label='名称'></el-table-column>
                <el-table-column label='操作' inline-template width='140px' >
                    <div>
                        <el-button type='text' icon='search'>
                        </el-button>
                        <el-button type='text' icon='edit'>
                        </el-button>
                        <el-button type='text' icon='delete'>
                        </el-button>
                            <el-button type='text' @click='onAddArea(row.ID)'>
                                <el-tooltip class="item" effect="dark" content="添加等值面" placement="right">
                                    <i class="el-icon-plus"></i>
                                </el-tooltip>
                            </el-button>
                    </div>
                </el-table-column>
            </el-table>
            <div style="padding:5px;">
                <el-button icon='plus' type='primary' size='small' style='width:100%;'>新增</el-button>
            </div>
        </div>

        <el-dialog title='等值面管理' :visible.sync='faceDialog' :before-close="handleClose">
            <el-form :model="form" label-width='80px'  :rules="rules" ref='form'>
                <el-form-item label="名称" prop='ISOSURFACE_NAME'>
                    <el-input v-model="form.ISOSURFACE_NAME" placeholder='请输入等值面名称'></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="颜色">
                            <el-color-picker v-model="form.ISOSURFACE_COLOR"></el-color-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="排序">
                            <el-input-number v-model="form.SORT" :min="1" :max="99"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label='范围' prop='GIS_AREAS'>
                    <el-input v-model="form.GIS_AREAS"  placeholder='请输入geojson格式范围数据'   type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="faceDialog = false">取 消</el-button>
                <el-button type="primary" @click="onAreaSubmit">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<style lang='less'>

</style>
<script>
    import { getThemeList,addIsosurface } from '../modules/service.js';

    const model = ()=>{
        return {
            MAP_ID:'',
            GIS_AREAS:'',
            ISOSURFACE_NAME:'',
            ISOSURFACE_COLOR:'',
            SORT:''
        }
    }

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                data:[],
                form:model(),
                faceDialog:false,
                loading:false,
                rules:{
                    'ISOSURFACE_NAME':[
                        {required:true, message: '请输入等值面名称', trigger: 'blur' }
                    ],
                    'GIS_AREAS':[
                        {required:true, message: '请输入等值面范围', trigger: 'blur' }
                    ]
                }
            }
        },

        methods:{
            render() {
                this.loading = true;
                getThemeList().then(rep=>{
                    rep = JSON.parse(rep);
                    this.data = rep;
                    this.loading = false;
                })
            },
            onClose() {
                 this.$emit('close');
            },
            onAddArea(id) {
                this.faceDialog = true;
                this.form.MAP_ID = id;
            },
            handleClose() {
                this.faceDialog = false;
            },
            onAreaSubmit() {
                this.$refs.form.validate(valid=>{
                    if(valid) {
                        addIsosurface(this.form).then(rep=>{
                            debugger
                        })
                    }

                })
            }

        },
        watch:{

        },
        mounted(){
            $(this.$el).find('.theme').slimScroll({ height: document.documentElement.clientHeight - 37 });
            this.render();
        }
    }
</script>
