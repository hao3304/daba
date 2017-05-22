<template>
    <div class="slider " style="z-index:1000">
        <div class='collapse-side' v-show='collapse'>
            <ul>
                <li v-for='(n,$index) in navs'  class='parent-menu' :class='{"is-opened":index === $index}'>
                <el-tooltip v-if='n.children.length == 0' class="item" effect="dark" :content="n.name" placement="right">
                    <a href='javascript:;' @click='onSelect(n.url)'><i :class='n.icon'></i></a>
                </el-tooltip>
                <a v-else href='javascript:;' @click='onSelect(n.url)'><i :class='n.icon'></i></a>
                    <ul class='children-menu' v-if='n.children.length>0'>
                        <li class='children-menu-header'>
                                <a>{{n.name}} <i class="el-submenu__icon-arrow el-icon-arrow-right"></i></a>
                        </li>
                        <li v-for='c in n.children' :class="{'active':active==c.url}">
                            <a href='javascript:;' @click.stop='onSelect(c.url,$event)'> <i :class='c.icon'></i>&nbsp;&nbsp;{{c.name}}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <div>

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
                    .children-menu{
                        display:block;

                    }
                }

                .children-menu{
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
                index:''
            }
        },
        methods:{
            onSelect:function (v,e) {
                this.container.left = v;
                switch(v){
                    case 'search':
                     this.index = 0;
                        break;
                    case 'tool':
                        this.index = 2;
                        break;
                    default:
                    this.index = 1;
                    break;
                }
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
            },
            'container.left'(left){
                if(!left){
                    this.index = '';
                }
            }
        },
        mounted:function () {
            this.navs = [
                {
                    id:'1',
                    name:'综合查询',
                    icon:'fa fa-search fa-size',
                    url:'search',
                    children:[
                    ]
                },
                {
                    id:'2',
                    name:'分类查询',
                    icon:'fa fa-cubes fa-size',
                    children:[
                        {
                            id:'2-1',
                            name:'主管单位',
                            children:[],
                            icon:'fa fa-bars',
                            url:'company',
                        },
                        {
                            id:'2-2',
                            name:'省市区域',
                            children:[],
                            icon:'fa fa-file-text',
                            url:'region',
                        },
                        {
                            id:'2-3',
                            name:'流域分类',
                            children:[],
                            icon:'fa fa-envelope ',
                            url:'river',
                        }
                    ]
                },{
                    id:'3',
                    name:'综合分析',
                    icon:'fa fa-pie-chart',
                    children:[
                        {
                            id:'3-1',
                            name:'流域分布',
                           icon:'fa fa-bandcamp',
                            url:'river-region'
                        },
                        {
                            id:'3-2',
                            name:'应急管理',
                            icon:'fa fa-ambulance',
                            url:'emergency'
                        },
                        {
                            id:'3-3',
                            name:'降雨分析',
                            icon:'fa fa-tint',
                            url:'rainfall'
                        },
                        {
                            id:'3-4',
                            name:'专题分析',
                            icon:'fa fa-photo',
                            url:'theme'
                        },
                        {
                            id:'3-4',
                            name:'自定义剖面',
                            icon:'fa fa-bar-chart',
                            url:'section'
                        }
                    ]
                },{
                    id:'3',
                    name:'工具栏',
                    icon:'fa fa-pencil',
                    url:'tool',
                    children:[]
                }
            ]

        }
    }
</script>
