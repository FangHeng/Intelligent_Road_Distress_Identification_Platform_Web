import {GaodeMap, LayerPopup, PointLayer, Scene, Zoom} from '@antv/l7';
import {formatDateTime} from "../../utils/utils";

function calculateCenter(uploadRecords) {
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

function initHomeMap(uploadRecords) {
    const center = calculateCenter(uploadRecords);
    // 初始化地图场景
    const scene = new Scene({
        id: 'homeMap',
        map: new GaodeMap({
            pitch: 0,
            center: center,
            zoom: 12,
            token: '65bf53c3527579a6a2bddfecf9b8d5ee',
        }),
        logoVisible: false,
    });

    console.log(uploadRecords.length);
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
                        {field: 'uploadTime', formatField: () => '上传时间', formatValue: (val) => formatDateTime(val)},
                        {field: 'uploadCount', formatField: () => '上传数量', formatValue: (val) => val.toString()},
                        {field: 'lng', formatField: () => '经度'},
                        {field: 'lat', formatField: () => '纬度'},
                        {field: 'integrity', formatField: () => '完好度', formatValue: (val) => `${Math.round(val * 100) / 100}%`},
                    ],
                },
            ],
            trigger: 'hover'
        });

        scene.addPopup(layerPopup);
    });

    return scene;

}

export default initHomeMap;

