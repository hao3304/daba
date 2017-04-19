<template>
    <div style="position:relative" class="ztree-wrap">
        <el-input @focus='show = true' size='small' v-model='name' ></el-input>
        <el-input style='display:none;' v-model='value'></el-input>
        <div v-show='show' class='tree-box'>
            <div class="ztree"></div>
        </div>
    </div>
</template>
<style lang='less'>
    .tree-box {
        border:1px solid #ddd;
        background-color: #fff;
        position: absolute;
        top:36px;
        z-index:1000;
        border-radius: 4px;
        box-shadow: 1px 1px 1px rgba(0,0,0,.4);
        width:100%;
        left:0;
        overflow: auto;
        max-height:400px;
    }
</style>
<script>
    import 'ztree'
    import 'ztree/css/zTreeStyle/zTreeStyle.css'

    export default{
        props:{
            value: {
                type:String
            },
            data: {
                type:Array,
                default:[]
            }
        },
        data(){
            return{
                show:false,
                name:'',
                id:''
            }
        },
        watch:{
            value(val) {
                  this.init();
            },
            id(val) {
                this.$emit('input',val);
            }
        },
        methods:{
            render() {
                let $tree = $(this.$el).find('.ztree');
                let self = this;
                this.tree = $.fn.zTree.init($tree,{
                    callback: {
                        onClick(event,treeid,node) {
                            self.name = node.name;
                            self.id = node.id;
                            self.show = false;
                        }
                    }
                },this.data)

            },
            init() {
               let node = this.tree.getNodeByParam('id',this.value);
               if(node){
                this.name = node.name;
                this.tree.selectNode(node);
               }else{
                this.name = '';
                this.tree.cancelSelectedNode();
               }
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.render();

                 if(this.value) {
                        this.init();
                 }
            })
            $(document).on('click',(e)=>{
                if($(e.target).parents('.ztree-wrap').length == 0){
                     this.show = false;
                }
            })


        }
    }
</script>
