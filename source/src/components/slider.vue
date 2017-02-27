<template>
    <div class="slider " style="z-index:10000">
        <div class="logo">
        <i class="fa fa-cloud"></i>
               <label>{{name}}</label>
        </div>
           <div class='collapse-side' v-show='collapse'>
            <ul>
                <li v-for='(n,$index) in navs'  class='parent-menu' >
                   <a @click="onClick(n)" href='javascript:;'><i :class='n.icon'></i></a>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang='less'>

    .btn-toggle .fa-bars{
        -webkit-transition: all .6s;
        -moz-transition: all .6s;
        -ms-transition: all .6s;
        -o-transition: all .6s;
        transition: all .6s;
    }

    .collapse-side{
        ul{
            margin:0;
            padding:0;
            li{
                list-style:none;
                position:relative;
                a{
                    display:block;
                    text-align:center;
                    color:#fff;
                    line-height:50px;
                    text-decoration:none;
                }

                &.is-opened{
                    background-color:#22282e !important;
                }

                &:hover,&:active{
                    background-color:#475669;
                    .chidlren-menu{
                        display:block;

                    }
                }

                .chidlren-menu{
                    display:none;
                    position:absolute;
                    width:130px;
                    left:50px;
                    top:0;
                    background-color:#1f2f3d;
                    border-top-right-radius:5px;
                    border-bottom-right-radius:5px;
                    li{
                        a{
                            font-size:12px;
                            text-decoration:none;
                            line-height:42px;

                        }

                        &.active{
                            background-color:#0099cc;
                        }
                    }

                    li.children-menu-header{
                        border-top-right-radius:5px;
                        background-color:#22282e;
                        a{
                            text-align:left;
                            padding-left:20px;
                            line-height:50px;
                        }
                    }
                }
            }
        }

    }
</style>
<script>
    export default{
        store:['container'],
        props:{
            name:''
        },
        data(){
            return {
                active:'',
                url:'',
                d:'',
                navs:[],
                collapse:true,
                index:0
            }
        },
        methods:{
            onClick:function (type) {
                this.container.mode ='left';
            }
        },
        watch:{
            navs:function () {
                this.$nextTick(function () {
                    $('#slider-menus').slimScroll({height:document.documentElement.clientHeight - 48});
                });

                $(window).resize(function(){
                    $('#slider-menus').slimScroll({height:document.documentElement.clientHeight - 48});
                })
            }
        },
        mounted:function () {
            this.navs = [
                {
                    id:'1',
                    name:'运维管理',
                    icon:'fa fa-th-large fa-size'
                },
                {
                    id:'2',
                    name:'网站管理',
                    icon:'fa fa-cog fa-size'
                }
            ]

        }
    }
</script>
