/**
 * Created by jack on 16/11/14.
 */

const Vue = require('vue/dist/vue.js');
const UI = require('element-ui');
const Router = require('vue-router');
import VueLocalStorage from 'vue-ls';

let options = {
    namespace: 'vuejs__'
};

require('./modules/datefomat');
require('/static/js/layer/skin/default/layer.css');
require('leaflet/dist/leaflet.css');
import "element-ui/lib/theme-default/index.css";

import VueStash from 'vue-stash';

Vue.use(VueStash);
Vue.use(UI);
Vue.use(Router);
Vue.use(VueLocalStorage, options);

import slider from './components/slider.vue';
import cheader from './components/header.vue';

import map from './views/map.vue';
import {store} from './store';
const routes = [
    { path: '/', component: map }
];

const router = new Router({
    routes
});

import { Gender, Status } from './modules/filters';
Vue.filter('Gender', Gender);
Vue.filter('Status', Status);

import {getDbList} from './modules/service';

new Vue({
    el: '#app',
    router: router,
    data: {
        store
    },
    components: {
        slider,
        cheader
    },
    methods: {
        onRoute: function (v) {
            this.$router.push(v);
        }
    },
    mounted: function () {
        var self = this;
        this.$nextTick(function () {
            $('.main').slimScroll({ height: document.documentElement.clientHeight });
        });

        $(window).resize(function(){
            $('.main').slimScroll({ height: document.documentElement.clientHeight });
        });

        $('.loading').hide();
    }
});
