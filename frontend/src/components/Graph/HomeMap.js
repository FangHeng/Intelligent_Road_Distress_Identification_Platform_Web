import { Scene } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';

function initMap(){
    const scene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new TencentMap({
            zoom: 10,
            minZoom: 5,
            maxZoom: 18
        })
    });

    return  scene;
}

export default initMap;
