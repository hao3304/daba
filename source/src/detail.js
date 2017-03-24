/**
 * Created by jack on 16/11/14.
 */

const Vue = require('vue/dist/vue.js');
const UI = require('element-ui');

require('./modules/datefomat');
require('/static/js/layer/skin/default/layer.css');
import {getDamInfo,getDamIntroduction,getDamProperty,getDamPictures} from './modules/service';
Vue.use(UI);
new Vue({
    el: '#app',
    data: {
        tab: '',
        loading:true,
        dbid:'',
        regAndCheck:'',
        introduction:{
            topPicture:'',
            introduction:''
        },
        property:[],
        radio:'',
        pic:[]

    },
    components: {

    },
    methods: {
        getQueryString(name){
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },

    },
    watch:{
        tab(t){
            switch (t){
                case 'first':
                    getDamInfo(this.dbid).then((rep)=>{
                        this.regAndCheck = rep[0].regAndCheck;
                        this.regAndCheck =  this.regAndCheck.replace(/&lt;h&gt;/g,'<h5>').replace(/&lt;\/h&gt;/g,'</h5>');
                    });
                    break;
                case 'second':
                    getDamIntroduction(this.dbid).then((rep)=>{
                        this.introduction = JSON.parse(decodeURI(encodeURI(rep).replace(/%0D%0A/g,'')))[0];
                    });
                    break;
                case 'third':
                    getDamProperty(this.dbid).then((rep)=>{
                        this.property = JSON.parse(decodeURI(encodeURI(rep).replace(/%0D%0A/g,'').replace(/%0A/g,'%20')))[0]['items'] || [];
                        if(this.property.length>0){
                            this.radio = this.property[0].groupName;
                        }
                    });
                    break;
                case 'fourth':
                    getDamPictures(this.dbid).then((rep)=>{
                        this.pic = JSON.parse(decodeURI(encodeURI(rep).replace(/%0D%0A/g,'')))[0]['pictures'] || [];
                    });
                    break;
            }
        }
    },
    mounted: function () {
        this.loading = false;
        this.tab='first';
        this.dbid = this.getQueryString('id');
        $('.loading').hide();
    }
});
