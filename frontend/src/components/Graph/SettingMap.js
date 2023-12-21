import {Fullscreen, GeoLocate, Scene, Zoom} from '@antv/l7';
import {GaodeMap} from '@antv/l7-maps';
import gcoord from 'gcoord';

function initSettingMap(setLoading, latitude = 39.90374, longitude = 116.397827){
    const scene = new Scene({
        id: 'settingMap',
        logoVisible: false,
        map: new GaodeMap({
            center: [longitude, latitude],
            zoom: 10,
            minZoom: 5,
            maxZoom: 18,
            token: '65bf53c3527579a6a2bddfecf9b8d5ee',
        })

    });
    scene.on('loaded', () => {
        const fullscreen = new Fullscreen({
            btnText: '全屏',
            exitBtnText: '退出全屏',
        });
        scene.addControl(fullscreen);

    });

    scene.on('loaded', () => {
        const geoLocate = new GeoLocate({
            transform: (position) => {
                // 将获取到基于 WGS84 地理坐标系 的坐标转成 GCJ02 坐标系
                console.log(gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02))
                return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
            },
        });
        scene.addControl(geoLocate);
    });

    scene.on('loaded', () => {
        setLoading(false);
        const zoom = new Zoom();
        scene.addControl(zoom);
    });


    return  scene;
}

export default initSettingMap;

