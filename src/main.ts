import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import poiGeojson from './poi.json'; // POIデータを読み込む

// MapLibre GL JSのMapインスタンスを初期化＝地図画面を作成
new Map({
    container: 'map',
    hash: true,
    style: {
        version: 8,
        sources: {
            osm: {
                // OpenStreetMapのタイルデータを定義
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            },
            poi: {
                // POIデータを定義
                type: 'geojson',
                data: poiGeojson,
                cluster: true,
                clusterMaxZoom: 15,
            },
            vectortile: {
                type: 'vector',
                tiles: [
                    // ルートディレクトリを参照する
                    `${window.location.origin}/sd-2023-12-sample/tiles/{z}/{x}/{y}.pbf`,
                ],
                maxzoom: 14,
            },
        },
        layers: [
            {
                // OpenStreetMapのタイルデータを表示
                id: 'osm',
                type: 'raster',
                source: 'osm',
            },
            {
                // 建物データを表示
                id: 'building',
                type: 'fill-extrusion', // 3Dの建物を描画するスタイル
                source: 'vectortile',
                'source-layer': 'building',
                paint: {
                    'fill-extrusion-color': '#a66',
                    'fill-extrusion-height': 10, // 高さを10mに設定
                    'fill-extrusion-opacity': 0.6,
                },
            },
            {
                // 道路データを表示
                id: 'road',
                type: 'line', // ラインを描画するスタイル
                source: 'vectortile',
                'source-layer': 'road',
                paint: {
                    'line-color': [
                      'case',
                      ['==', ['get', 'fclass'], 'primary'], '#f00',
                      ['==', ['get', 'fclass'], 'secondary'], '#ff0',
                      ['==', ['get', 'fclass'], 'tertiary'], '#0a0',
                      ['==', ['get', 'fclass'], 'residential'], '#00f',
                      '#000',
                  ],
                    'line-width': [
                        'case',
                        ['==', ['get', 'fclass'], 'primary'], 10,
                        ['==', ['get', 'fclass'], 'secondary'], 8,
                        ['==', ['get', 'fclass'], 'tertiary'], 6,
                        ['==', ['get', 'fclass'], 'residential'], 4,
                        2,
                    ],
                },
            },
            {
                // POIデータを表示
                id: 'poi',
                type: 'circle',
                source: 'poi',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['get', 'point_count'],
                        1,
                        10,
                        500,
                        50,
                        2000,
                        70,
                    ],
                    'circle-color': '#aaaaff',
                    'circle-stroke-color': '#000000',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.8,
                },
            },
        ],
    },
    center: [143.95, 43.65],
    zoom: 6,
});