<template>
          <div class="el-menu-demo header" style="border-right: 0;border-bottom: 0" mode="horizontal" :default-active='active' @select='onSelect'>
              <h5 style="text-shadow: 1px 1px 1px #666;position: absolute;left: 15px;top:5px;color: #fff;margin: 0;font-size: 22px;">全国大坝分布展示系统</h5>

              <el-autocomplete
                      style="position: absolute;width: 220px;top:5px;left: 260px;"
                      class="inline-input"
                      v-model="query"
                      size='small'
                      icon='search'
                      :fetch-suggestions="querySearch"
                      placeholder="请输入查询内容"
                      :trigger-on-focus="false"
                      @select="handleSelect"
              >
              </el-autocomplete>
          </div>
</template>
<style lang='less'>

</style>
<script>
    export default{
        store:['dam','search'],
        data(){
            return{
                active:'',
                query:''
            }
        },
        methods:{
            onSelect:function(key){
                if(key == 'layout'){
                    layer.confirm('确定退出系统?',{title:'提示'},function(){
                        $.post('/dap/user/logout.json',{},function(rep){
                            if(rep.Code==0){
                                window.location.href = '/login.html';
                            }else{
                                layer.alert(rep.Message);
                            }
                        })
                    })
                }
            },
            querySearch(queryString,cb){
                let list = this.dam.list;
                let result = queryString?list.filter((l)=>l.dbmc.indexOf(queryString.toLowerCase())>-1):list;
                cb(result.map((r)=>{return {value:r.dbmc,...r}}));
            },
            handleSelect(v){
                  this.search = {...v};
            }
        },
        watch:{
            navs:function () {
                this.active = this.navs[this.navs.length-1].Id;
            }
        }
    }
</script>
