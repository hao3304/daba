/**
 * Created by jack on 2017/2/21.
 */

export const store = {
    container:{
        mode:'center',
        left:false,
        right:false
    },
    _map:null,
    dam:{
        list:[],
        legend:[],
        rivers:[],
        source:[]
    },
    layer:{
        mode:'全国',
        legend:[],
        legend2:['在建','已建','前期','规划'],
        state:['已核','未核']
    },
    rightSpan:{
        list:[],
        name:''
    },
    search:{},
    login:{
        show:false,
        name:'',
        id:''
    },
    addList:[] /*没有位置需要添加的大坝*/
}