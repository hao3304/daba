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

export const getDma = (params={})=>co($.getJSON(`${prefix}/GIS/searchDam/searchDam.jsp`,{riverids:'',provinces:'',citys:'',isplaced:'',...params}));
export const getLegend = ()=>co($.getJSON(`${prefix}/GIS/searchDam/getLegendList.jsp`));
export const getDamInfo = (id)=>co($.getJSON(`${prefix}/GIS/searchDam/getDamInfo.jsp?dbid=${id}`));
export const getDamIntroduction = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamIntroduction.jsp`,{dbid:id},'text'));
export const getDamProperty = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamProperty.jsp`,{dbid:id},'text'));
export const getDamPictures = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamPictures.jsp`,{dbid:id},'text'));
export const getSearchCondition = ()=>co($.get(`${prefix}/GIS/searchDam/getSearchCondition.jsp`),{},'json');
export const getZGDWList = ()=>co($.get(`${prefix}/GIS/searchDam/getZGDWList.jsp`),{},'json');
export const getLoginInfo = ()=>co($.get(`${prefix}/GIS/getLoginInfo.jsp`),{},'json');
export const logout = ()=>co($.get(`${prefix}/GIS/logout.jsp`));
export const doLogin = (p = {username:'',password:''})=>co($.getJSON(`${prefix}/GIS/loginOk.jsp?username=${p.username}&&password=${p.password}`));


export const getPlaceNames = (params={})=>{
    if(params.regiontype){
        return co($.getJSON(`${prefix}/DataService.svc/PlaceNames`,{regiontype:'city',...params}));
    }else{
        return co($.getJSON('/static/json/region.json'));
    }
};

export const getCustomPlaceNames = ()=>co($.get('/DataService.svc/CustomPlaceNames'));
export const getRivers = (params={rivertype:1})=>co($.get('/DataService.svc/Rivers',params));
export const getRiverDam = (params)=>co($.get('/DataService.svc/RiverDam',params));
export const queryByCustomNames = (params)=>co($.get('/DataService.svc/CustomPlaceNamesByCustomName',params));
