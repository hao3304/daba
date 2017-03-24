<template>
          <div>
              <el-button style='margin-top:10px;' type='info' size='small' class='login-btn' v-if='!login.id' @click='login.show = true'>
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
                    yes:()=>{
                        logout().then((rep)=>{
                            rep = JSON.parse(rep);
                            if(rep.result && rep.result == 'success'){
                                layer.open({content:'退出成功！'});
                                layer.closeAll();
                                this.login.name = '';
                                this.login.id = '';
                                window.location.reload();
                            }
                        })
                    }
                })
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
