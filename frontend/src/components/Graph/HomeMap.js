import {Fullscreen, GaodeMap, LayerPopup, MapTheme, PointLayer, Scene, TencentMap, Zoom} from '@antv/l7';
import { IconImageLayer } from '@antv/l7-composite-layers';

function initHomeMap(setLoading){
    // const scene = new Scene({
    //     id: 'homeMap',
    //     map: new GaodeMap({
    //         pitch: 0,
    //         center: [120.154672, 30.241095],
    //         zoom: 12,
    //         token: '65bf53c3527579a6a2bddfecf9b8d5ee',
    //     }),
    //     logoVisible: false,
    // });
    // scene.on('loaded', () => {
    //     const pointLayer = new PointLayer({});
    //     pointLayer
    //         .source(
    //             [
    //                 {
    //                     lng: 120.132235,
    //                     lat: 30.250868,
    //                     value: 34.71314604052238,
    //                     name: '坐标点1',
    //                 },
    //                 {
    //                     lng: 120.156236,
    //                     lat: 30.260268,
    //                     value: 96.807880210153,
    //                     name: '坐标点2',
    //                 },
    //                 {
    //                     lng: 120.163014,
    //                     lat: 30.251297,
    //                     value: 29.615472482876815,
    //                     name: '坐标点3',
    //                 },
    //                 {
    //                     lng: 120.15394,
    //                     lat: 30.231489,
    //                     value: 49.90316258911784,
    //                     name: '坐标点4',
    //                 },
    //                 {
    //                     lng: 120.154596,
    //                     lat: 30.24065,
    //                     value: 45.788587061188466,
    //                     name: '坐标点5',
    //                 },
    //                 {
    //                     lng: 120.150223,
    //                     lat: 30.235078,
    //                     value: 29.741111717098544,
    //                     name: '坐标点6',
    //                 },
    //                 {
    //                     lng: 120.143992,
    //                     lat: 30.229411,
    //                     value: 40.241555782182935,
    //                     name: '坐标点7',
    //                 },
    //                 {
    //                     lng: 120.136995,
    //                     lat: 30.237439,
    //                     value: 86.5369792415296,
    //                     name: '坐标点8',
    //                 },
    //             ],
    //             {
    //                 parser: {
    //                     type: 'json',
    //                     x: 'lng',
    //                     y: 'lat',
    //                 },
    //             },
    //         )
    //         .color('value', ['#FFCCC6', '#CF1421'])
    //         .size(10)
    //         .shape('circle');
    //     scene.addLayer(pointLayer);
    //     const layerPopup = new LayerPopup({
    //         items: [
    //             {
    //                 layer: pointLayer,
    //                 fields: [
    //                     {
    //                         field: 'name',
    //                         formatField: () => '名称',
    //                     },
    //                     {
    //                         field: 'value',
    //                         formatField: () => '权值',
    //                         formatValue: (val) => val.toFixed(2),
    //                     },
    //                     'lng',
    //                     'lat',
    //                 ],
    //             },
    //         ],
    //         trigger:'hover'
    //     });
    //
    //
    //
    //     scene.addPopup(layerPopup);
    // });

    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
        .then((response) => response.json())
        .then((data) => {
            const scene = new Scene({
                id: 'homeMap',
                map: new GaodeMap({
                    pitch: 0,
                    style: 'dark',
                    zoom: 3,
                    center: [120.19660949707033, 30.234747338474293],
                    token: '65bf53c3527579a6a2bddfecf9b8d5ee',
                }),
            });
            scene.on('loaded', () => {
                const iconLayer = new IconImageLayer({
                    id: 'iconImageLayer1',
                    autoFit: true,
                    source: {
                        data,
                        parser: {
                            type: 'json',
                            x: 'longitude',
                            y: 'latitude',
                        },
                    },
                    // color:{
                    //   value:'red',
                    // },
                    iconAtlas: {
                        icon1: 'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
                        icon2: 'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
                    },
                    icon: 'icon1',
                    radius: {
                        field: 'unit_price',
                        value: [1, 20],
                    },
                    opacity: 1,
                    label: {
                        field: 'name',
                        state: {
                            active: {
                                color: 'blue',
                            },
                        },
                        style: {
                            fill: '#fff',
                            opacity: 0.6,
                            fontSize: 12,
                            textAnchor: 'top',
                            textOffset: [0, -40],
                            spacing: 1,
                            padding: [5, 5],
                            stroke: '#ffffff',
                            strokeWidth: 0.3,
                            strokeOpacity: 1.0,
                        },
                    },
                    state: {
                        active: false,
                        select: {
                            radius: 20,
                            opacity: 1,
                            icon: 'icon2',
                        },
                    },
                });
                scene && iconLayer.addTo(scene);
                scene.on('loaded', () => {
                    const zoom = new Zoom({
                        zoomInTitle: '放大',
                        zoomOutTitle: '缩小',
                    });
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
            });
        });

}

export default initHomeMap;

