<template>
    <div class="login-modal" v-show='login.show' >
       <div class='login-container'>
           <transition name='zoom'>
           <el-card class='login-form'  v-show='login.show' >
               <div slot="header" style='text-align:left;'>
                   <span>登录</span>
                   <el-button style="float: right;" size='small' type="text" @click='login.show = false' icon='close'></el-button>
               </div>
               <el-form ref='loginForm' :rules='rules' label-width="80px" :model='form' >
                   <el-form-item label="用户名" prop='username' placeholder='请输入用户名' size='small' >
                       <el-input placeholder='请输入用户名' v-model='form.username' ></el-input>
                   </el-form-item>
                   <el-form-item label="密码" prop='password'  >
                       <el-input type="password" v-model='form.password' placeholder='请输入密码' ></el-input>
                   </el-form-item>
                   <div>
                       <el-button type="primary" @click="onSubmit">马上登录</el-button>
                       <el-button  @click='login.show = false' >取消</el-button>
                   </div>
               </el-form>
           </el-card>
           </transition>
       </div>
    </div>
</template>
<style lang='less'>
    .login-modal{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        display:table;
        background-color:rgba(0,0,0,.4);
        z-index:2000;
    }

    .login-container{
        display: table-cell;
        width: 100%;
        height: 100%;
        text-align: center;
        vertical-align: middle;

    }

    .login-form{
        width:360px;
        margin:0 auto;
    }

    .zoom-enter-active,.zoom-leave-active{
        animation:zoom-in 0.4s;
    }

    @keyframes zoom-in{
        0%{
            transform:scale(1.1);
            opacity:0;
        }

        100%{
            transform:scale(1);
            opacity:1;
        }

    }

</style>
<script>
    import {doLogin} from '../modules/service';

    export default{
        store:['login'],
        data(){
            return {
                form:{
                    username:'',
                    password:''
                },
                rules:{
                    username:[
                        {required:true,message:'请输入用户名'}
                    ],
                    password:[
                        {required:true,message:'请输入密码'}
                    ]
                }
            }
        },
        methods:{
            onSubmit(){
                this.$refs.loginForm.validate((valid)=>{
                    if(valid){
                        layer.load(1);
                        doLogin(this.form).then((rep)=>{
                        layer.closeAll();
                            if(rep.length>0&&rep[0].realname){
                                this.login.show = false;
                                this.login.name = rep[0].realname;
                                this.login.id = rep[0].userid;
                                 this.$message({
                                  message: `用户【${this.login.name}】登录成功`,
                                  type: 'success'
                                });
                            }else{
                                 let hint = rep[0].hint;
                                 this.$message({
                                  message: hint,
                                  type: 'warning'
                                });
                            }
                        })
                    }
                })
            }
        },
        watch:{
            'login.show'(show){
                if(show){
                    this.$refs.loginForm.resetFields();
                }
            },
            active(type){
                this.$emit('change',type);
            }
        }
    }
</script>
