<template>
 <div class="wrap">
  <slider   @change="onRoute" ></slider>
  <section>
   <div class="main">
    <div style="position:relative;height: 100%">
     <router-view style="position:absolute;width:100%" ></router-view>
    </div>
   </div>
  </section>
 </div>
</template>
<style>

</style>
<script>

    import slider from './components/slider.vue';
    import cheader from './components/header.vue';

    export default{
        data(){
            return{

            }
        },
        methods:{
          onRoute: function (v) {
            this.$router.push(v);
         }
        },
        components:{
            slider,
            cheader
        }
    }

</script>