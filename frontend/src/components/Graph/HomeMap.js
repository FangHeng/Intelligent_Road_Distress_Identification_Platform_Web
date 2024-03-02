import {Fullscreen, GaodeMap, LayerPopup, MapTheme, PointLayer, Scene, Zoom} from '@antv/l7';
import {formatDateTime} from "../../utils/utils";
import {themeStore} from "../../store/ThemeStore";

function calculateCenter(uploadRecords) {
    if (uploadRecords.length === 0) {
        return [116.397827, 39.90374];
    }
    let totalLongitude = 0;
    let totalLatitude = 0;
    let count = 0;

    uploadRecords.forEach(record => {
        totalLongitude += parseFloat(record.road__gps_longitude);
        totalLatitude += parseFloat(record.road__gps_latitude);
        count++;
    });

    return count > 0 ? [totalLongitude / count, totalLatitude / count] : null;
}

function calculateZoom(uploadRecords) {
    if (uploadRecords.length === 0) {
        return 12; // 默认缩放级别
    }

    let minLongitude = Number.MAX_VALUE;
    let maxLongitude = -Number.MAX_VALUE;
    let minLatitude = Number.MAX_VALUE;
    let maxLatitude = -Number.MAX_VALUE;

    uploadRecords.forEach(record => {
        const longitude = parseFloat(record.road__gps_longitude);
        const latitude = parseFloat(record.road__gps_latitude);

        if (longitude < minLongitude) minLongitude = longitude;
        if (longitude > maxLongitude) maxLongitude = longitude;
        if (latitude < minLatitude) minLatitude = latitude;
        if (latitude > maxLatitude) maxLatitude = latitude;
    });

    // 根据边界框计算合适的缩放级别
    // 注意：这里的逻辑可能需要根据高德地图的具体缩放级别细节进行调整
    const longitudeDiff = maxLongitude - minLongitude;
    const latitudeDiff = maxLatitude - minLatitude;

    // 示例计算逻辑，可能需要根据实际情况进行调整
    const zoom = 12 + Math.log(Math.max(longitudeDiff, latitudeDiff)) / Math.log(2);

    return zoom;
}


function initHomeMap(uploadRecords) {
    const center = calculateCenter(uploadRecords);
    const zoom = calculateZoom(uploadRecords);
    const mapStyle = themeStore.theme === 'dark' ? 'darkblue' : 'normal';
    // 初始化地图场景
    const scene = new Scene({
        id: 'homeMap',
        map: new GaodeMap({
            pitch: 0,
            center: center,
            // zoom: zoom,
            zoom: 11,
            style: mapStyle,
            token: `${process.env.REACT_APP_GAODE_MAP_KEY}`,
        }),
        logoVisible: false,
    });

    if (uploadRecords.length !== 0) {
        scene.on('loaded', () => {
            // 转换数据并创建点图层
            const data = uploadRecords.map(record => ({
                lng: parseFloat(record.road__gps_longitude),
                lat: parseFloat(record.road__gps_latitude),
                name: record.road__road_name,
                uploader: record.uploader__user__username,
                uploadTime: record.upload_time,
                uploadCount: record.upload_count,
                integrity: record.integrity,
            }));

            const pointLayer = new PointLayer({})
                .source(data, {
                    parser: {
                        type: 'json',
                        x: 'lng',
                        y: 'lat',
                    },
                })
                .color('integrity', ['#CF1421', '#fa796a', "#FFCCC6"])
                // .color('#CF1421')
                .size(10)
                .shape('circle');

            scene.addLayer(pointLayer);

            // 设置弹出窗口
            const layerPopup = new LayerPopup({
                items: [
                    {
                        layer: pointLayer,
                        fields: [
                            {field: 'name', formatField: () => '道路名称'},
                            {field: 'uploader', formatField: () => '上传者'},
                            {
                                field: 'uploadTime',
                                formatField: () => '上传时间',
                                formatValue: (val) => formatDateTime(val)
                            },
                            {field: 'uploadCount', formatField: () => '上传数量', formatValue: (val) => val.toString()},
                            {field: 'lng', formatField: () => '经度'},
                            {field: 'lat', formatField: () => '纬度'},
                            {
                                field: 'integrity',
                                formatField: () => '完好度',
                                formatValue: (val) => `${Math.round(val * 100) / 100}%`
                            },
                        ],
                    },
                ],
                trigger: 'hover'
            });

            scene.addPopup(layerPopup);
        });
    }

    scene.on('loaded', () => {
        const zoom = new Zoom();
        scene.addControl(zoom);
    });

    scene.on('loaded', () => {
        const fullscreen = new Fullscreen({
            btnText: '全屏',
            exitBtnText: '退出全屏',
        });
        scene.addControl(fullscreen);
    });

    scene.on('loaded', () => {
        const mapTheme = new MapTheme({});
        scene.addControl(mapTheme);
    });
    return scene;

}

export default initHomeMap;

