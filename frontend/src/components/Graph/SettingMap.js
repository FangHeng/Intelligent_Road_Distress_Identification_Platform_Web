import { Scene } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';

function initSettingMap(){
    const scene = new Scene({
        id: 'settingMap',
        logoVisible: false,
        map: new TencentMap({
            zoom: 10,
            minZoom: 5,
            maxZoom: 18
        })
    });

    return  scene;
}

export default initSettingMap;