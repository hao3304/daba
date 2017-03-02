<template>
          <div class="el-menu-demo header" style="border-right: 0;border-bottom: 0" mode="horizontal" :default-active='active' @select='onSelect'>
              <h5 style="text-shadow: 1px 1px 1px #666;position: absolute;left: 15px;top:5px;color: #fff;margin: 0;font-size: 22px;">全国大坝分布展示系统</h5>

              <el-autocomplete
                      style="position: absolute;width: 220px;top:5px;left: 260px;"
                      class="inline-input"
                      v-model="query"
                      size='small'
                      :icon='icons'
                      :fetch-suggestions="querySearch"
                      placeholder="请输入查询内容"
                      :trigger-on-focus="false"
                      :on-icon-click="handleIconClick"
                      @select="handleSelect"
              >
              </el-autocomplete>

              <el-button type='info' size='small' class='login-btn' v-if='!login.id' @click='login.show = true'>
                  <i class='fa fa-sign-in'></i>
                  登录
              </el-button>

              <el-dropdown class='user-info'  v-if='login.id'  @command='onLoginout'>
                  <el-button type="primary" size='small' >
                     <i class='fa fa-user'></i> {{login.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown" size='small' >
                      <el-dropdown-item style='font-size:12px;line-height:20px;' command='loginout'>退出</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>

          </div>
</template>
<style lang='less'>
    .login-btn{
        float:right;
        font-size:14px;
        text-decoration:none;
        margin-top: 9px;
    }

    .user-info{
        margin-top: 6px;
        float:right;
    }
</style>
<script>
    import { getLoginInfo,logout } from '../modules/service';

    export default{
        store:['dam','search','login'],
        data(){
            return{
                active:'',
                query:''
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
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
            },
            handleIconClick(){
                this.query = '';
            },
            onLoginout(){
                layer.open({
                    content:'确定退出当前用户？',
                    title:'提示',
                    btn:['确定','取消'],
                    yes(){
                        logout().then((rep)=>{
                            if(rep.result && rep.result == 'success'){
                                layer.open({content:'退出成功！'});
                                layer.closeAll();
                                this.login.name = '';
                                this.login.id = '';
                            }
                        })
                    }
                })
            }
        },
        watch:{
            navs:function () {
                this.active = this.navs[this.navs.length-1].Id;
            }
        },
        mounted(){
            getLoginInfo().then((rep)=>{
                let result = JSON.parse(rep);
                if(result&&result.realname){
                    this.login = $.extend(this.login,{name:result.realname,id:result.userid});
                }
            })
        }
    }
</script>
