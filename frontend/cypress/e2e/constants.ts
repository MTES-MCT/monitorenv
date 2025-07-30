export const FAKE_API_POST_RESPONSE = {
  body: {},
  statusCode: 201
}

export const FAKE_API_PUT_RESPONSE = {
  body: {},
  statusCode: 200
}

export const FAKE_MAPBOX_RESPONSE = {
  body: {
    bearing: 0,
    center: [3.5028040862405874, 42.873664619796756],
    created: '2021-07-20T09:27:37.067Z',
    draft: false,
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    id: 'ckrbusml50wgv17nrzy3q374b',
    layers: [],
    metadata: {},
    modified: '2021-08-27T13:07:01.713Z',
    name: 'MonitorFish_Anthracite_clair',
    owner: 'monitorfish',
    pitch: 0,
    protected: false,
    sources: {
      composite: { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2' }
    },
    sprite: 'mapbox://sprites/monitorfish/ckrbusml50wgv17nrzy3q374b/0w8s9zjz17tgwspxudxbjsx3m',
    version: 8,
    visibility: 'private',
    zoom: 8.876283025155784
  },
  statusCode: 200
}

export const FAKE_WINDY_RESPONSE = {
  body: {},
  statusCode: 200
}

export const FAKE_MISSION_WITH_EXTERNAL_ACTIONS = {
  body: { canDelete: false, sources: ['MONITORFISH', 'RAPPORT_NAV'] },
  statusCode: 200
}

export const PAGE_CENTER_PIXELS = [640, 512] as [number, number]
