<template>
        <el-autocomplete
                style="position: absolute;width: 220px;top:8px;left: 60px;line-height: initial;z-index:1000"
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
</template>
<style lang='less'>

</style>
<script>
     import { getLoginInfo } from '../modules/service';

    export default{
        store:['dam','search'],
        data(){
            return{
                query:''
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
            }
        },
        methods:{
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
            }
        }
    }
</script>
