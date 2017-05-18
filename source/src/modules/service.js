/**
 * Created by jack on 16/11/14.
 */
// const prefix = 'http://122.224.167.105';
const prefix = '';

function co(func) {
    return $.Deferred(function(def){
        return func.then(function(rep){
             return def.resolve(rep);
        });
    });
}

export const getDma = (params={})=>co($.getJSON(`${prefix}/GIS/searchDam/searchDam.jsp`,params));
export const getLegend = ()=>co($.getJSON(`${prefix}/GIS/searchDam/getLegendList.jsp`));
export const getDamInfo = (id)=>co($.getJSON(`${prefix}/GIS/searchDam/getDamInfo.jsp?dbid=${id}`));
export const getDamIntroduction = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamIntroduction.jsp`,{dbid:id},'text'));
export const getDamProperty = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamProperty.jsp`,{dbid:id},'text'));
export const getDamPictures = (id)=>co($.get(`${prefix}/GIS/searchDam/getDamPictures.jsp`,{dbid:id},'text'));
export const getSearchCondition = ()=>co($.get(`${prefix}/GIS/searchDam/getSearchCondition.jsp`),{},'json');
export const getZGDWList = ()=>co($.get(`${prefix}/GIS/searchDam/getZGDWList.jsp`),{},'json');
export const getLoginInfo = ()=>co($.get(`${prefix}/GIS/getLoginInfo.jsp`),{},'json');
export const logout = ()=>co($.get(`${prefix}/GIS/logout.jsp`));
export const getDbList = ()=>co($.get(`${prefix}/GIS/addPosition/getDbList.jsp?isplaced=0`,'json'));
export const setDbPosition = (params)=>co($.get(`${prefix}/GIS/addPosition/setDbPosition.jsp`,params,'json'));
export const delDam = (id)=>co($.get(`${prefix}/GIS/addPosition/delDam.jsp`,{dbid:id},'json'));
export const doLogin = (p = {username:'',password:''})=>co($.getJSON(`${prefix}/GIS/loginOk.jsp?username=${p.username}&&password=${p.password}`));
export const getEmergency = (params)=>co($.get(`${prefix}/GIS/emergencySupport/getAccidentList.jsp`,params));
export const getAccidentInfo = (params)=>co($.get(`${prefix}/GIS/emergencySupport/getAccidentInfo.jsp`,params));
export const getAnalyseResult = (params)=>co($.get(`${prefix}/GIS/rainPicture/getAnalyseResult.jsp`,params));

export const getPlaceNames = (params={})=>{
    if(params.regiontype){
        return co($.getJSON(`${prefix}/DataService.svc/PlaceNames`,{regiontype:'city',...params}));
    }else{
        return co($.getJSON('/static/json/region.json'));
    }
};

export const getCustomPlaceNames = ()=>co($.get('/DamGIS/placename/placename!findCustomPlaceNames.action'));
export const getRivers = ()=>co($.get('/GIS/searchDam/getRiverTree.jsp'));
export const getRiverDam = (params)=>co($.get('/DataService.svc/RiverDam',params));
export const queryByCustomNames = (params)=>co($.get('/DamGIS/placename/placename!findCustomPlaceNameListByCustomName.action',params));
export const querySubRiverIDs = (params)=>co($.get('/DamGIS/river/river!findSubRivers.action',params));

export const getRegion = ()=>co($.get('http://api.rsafety.com.cn:8006/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc:region_dam&maxFeatures=50&outputFormat=JSON'));
export const getRiver = (layers,id)=>co($.get(`http://api.rsafety.com.cn:8006/geoserver/nyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nyc:river_dam&maxFeatures=99&CQL_FILTER=RegionID=${id}&outputFormat=JSON`));

