package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import org.n52.jackson.datatype.jts.GeometrySerializer

//{
//  "type": "Feature",
//  "geometry": {
//    "type": "Point",
//    "coordinates": [125.6, 10.1]
//  },
//    "properties": {
//    "name": "Dinagat Islands"
//  }
//}
data class GeoJsonOutput (
  val type: String,
  val geometry: GeometrySerializer
)