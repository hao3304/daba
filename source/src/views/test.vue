<template>
    <div>
        <itree v-model='msg' :data='tree'></itree>
        {{msg}}
    </div>
</template>
<style>
    body{
    }

</style>
<script>
    import itree from '../components/itree.vue'

    export default{
        data(){
            return{
                msg:'1',
                tree:[{id:1, pId:0, name: "父节点1"},
                    {id:11, pId:1, name: "子节点1"},
                    {id:12, pId:1, name: "子节点2"}]
            }
        },
        components:{
            itree
        }
    }

</script>
