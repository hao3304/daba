/**
 * Created by jack on 2017/2/24.
 */

import L from 'leaflet';


L.Control.ZoomHome = L.Control.extend({
    onAdd(){
        const wrap = L.DomUtil.create('div');
        wrap.className = 'leaflet-bar';
        const btn = L.DomUtil.create('a');
        btn.className = 'fa fa-home';
        wrap.append(btn);

        L.DomEvent.on(btn,'click',()=>{
            this._map.setView(this._map.options.center,this._map.options.zoom);
        },this);
        return wrap;
    }
});

L.control.zoomhome = function(opts) {
    return new L.Control.ZoomHome(opts);
}