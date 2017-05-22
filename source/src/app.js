/**
 * Created by jack on 16/11/14.
 */

const Vue = require('vue');
const UI = require('element-ui');
const Router = require('vue-router');
require('es6-promise').polyfill();

require('./modules/datefomat');
require('/static/js/layer/skin/default/layer.css');
require('leaflet/dist/leaflet.css');
import "element-ui/lib/theme-default/index.css";

import VueStash from 'vue-stash';
import VueLocalStorage from 'vue-ls';
Vue.use(VueLocalStorage);
Vue.use(VueStash);
Vue.use(UI);
Vue.use(Router);


import map from './views/map.vue';
import itree from './views/test.vue';
import {store} from './store';
import app from './views/app.vue';
const routes = [
    { path: '/', component: map },
    { path: '/test', component: itree },
];

const router = new Router({
    routes
});

import { Gender, Status } from './modules/filters';
Vue.filter('Gender', Gender);
Vue.filter('Status', Status);


new Vue({
    router: router,
    data: {
        store
    },
    render:h=>h(app),
    mounted: function () {
        this.$nextTick(function () {
            $('.main').slimScroll({ height: document.documentElement.clientHeight });
        });

        $(window).resize(function(){
            $('.main').slimScroll({ height: document.documentElement.clientHeight });
        });

        $('.loading').hide();
    }
}).$mount('#app')
