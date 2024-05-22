import {Fullscreen, Scene, Zoom} from '@antv/l7';
import {GaodeMap} from '@antv/l7-maps';
import {themeStore} from '../../store/ThemeStore';

function initSettingMap( latitude = 39.90374, longitude = 116.397827){
    const mapStyle = themeStore.theme === 'dark' ? 'darkblue' : 'normal';
    const center = [longitude, latitude];

    const scene = new Scene({
        id: 'settingMap',
        logoVisible: false,
        map: new GaodeMap({
            center: center,
            zoom: 10,
            minZoom: 5,
            maxZoom: 18,
            style: mapStyle,
            token: `${process.env.REACT_APP_GAODE_MAP_KEY}`,
        })
    });
    scene.on('loaded', () => {
        const fullscreen = new Fullscreen({
            btnText: '全屏',
            exitBtnText: '退出全屏',
        });
        scene.addControl(fullscreen);

    });

    // scene.on('loaded', () => {
    //     const geoLocate = new GeoLocate({
    //         transform: (position) => {
    //             // 将获取到基于 WGS84 地理坐标系 的坐标转成 GCJ02 坐标系
    //             console.log(gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02))
    //             return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
    //         },
    //     });
    //     scene.addControl(geoLocate);
    // });

    scene.on('loaded', () => {
        const zoom = new Zoom();
        scene.addControl(zoom);
    });

    return  scene;
}

export default initSettingMap;

