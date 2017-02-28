/**
 * Created by jack on 16/11/14.
 */
const axios = require('axios');
// const prefix = 'http://122.224.167.105';
const prefix = '';

function co(func) {
    return $.Deferred(function(def){
        return func.then(function(rep){
             return def.resolve(rep);
        });
    });
}
//
// function CRUD(service,model){
//     return {
//         all:(params)=>{return co(axios.post(`/${service}/${model}/page.json`,params))},
//         find:(id)=>{return co(axios.get(`/${service}/crud/${model}/${id}`))},
//         add:(params)=>{return co(axios.post(`/${service}/crud/${model}.json`,params))},
//         update:(id,params)=>{return co(axios.put(`/${service}/crud/${model}/${id}`,params))},
//         del:(id)=>{return co(axios.delete(`/${service}/crud/${model}/${id}`))}
//     }
// }
//
// export const User = CRUD('dap','user');

export const getDma = (params={})=>co($.getJSON(`${prefix}/GIS/searchDam/searchDam.jsp`,{riverids:'',provinces:'',citys:'',isplaced:'',...params}));
export const getLegend = ()=>co($.getJSON(`${prefix}/GIS/searchDam/getLegendList.jsp`));
export const getDamInfo = (id)=>co($.getJSON(`${prefix}/GIS/searchDam/getDamInfo.jsp?dbid=${id}`));
export const getDamIntroduction = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamIntroduction.jsp`,{dbid:id},'text'));
export const getDamProperty = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamProperty.jsp`,{dbid:id},'text'));
export const getDamPictures = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamPictures.jsp`,{dbid:id},'text'));
export const getSearchCondition = ()=>co($.get(`${prefix}/GIS/searchDam/getSearchCondition.jsp`),{},'json');
export const getZGDWList = ()=>co($.get(`${prefix}/GIS/searchDam/getZGDWList.jsp`),{},'json');


