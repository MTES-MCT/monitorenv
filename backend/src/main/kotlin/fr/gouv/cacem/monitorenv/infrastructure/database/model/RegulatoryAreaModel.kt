package fr.gouv.cacem.monitorenv.infrastructure.database.model


import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
//import com.bedatadriven.jackson.datatype.jts.serialization.GeometryDeserializer;
//import com.bedatadriven.jackson.datatype.jts.serialization.GeometrySerializer;


import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType

import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import org.hibernate.annotations.Type

//import org.springframework.data.geo.Point
//import org.geolatte.geom.C2D
//import org.geolatte.geom.Point
// import com.vividsolutions.jts.geom.Point;
import org.locationtech.jts.geom.Point
//import org.postgis.MultiPolygon
//import com.vividsolutions.jts.geom.MultiPolygon
// import org.hibernate.spatial.GeolatteGeometryType
// import org.hibernate.spatial.JTSGeometryType
import javax.persistence.*

@Entity
@Table(name = "regulations_cacem")
data class RegulatoryAreaModel(
    @Id
    @Column(name = "id")
    var id: Int,
//    @Type(type="point")
//    @JsonSerialize(using = GeometrySerializer.class)
//    @JsonDeserialize(using = GeometryDeserializer.class)
    @Column(name = "geom", columnDefinition = "Geometry(Point,4326)")
    //@Column(name = "geom", columnDefinition = "Point")
    //@Type(type="org.hibernate.spatial.JTSGeometryType")
    //@Column(name = "geom")
    //var geom: Point<C2D>?,
    var geom: Point,
    @Column(name ="entity_name")
    var entity_name: String?,
    @Column(name ="url")
    var url: String?,
    @Column(name ="layer_name")
    var layer_name: String?,
    @Column(name ="facade")
    var facade: String?,
    @Column(name ="ref_reg")
    var ref_reg: String?,
    @Column(name ="edition")
    var edition: String?,
    @Column(name ="editeur")
    var editeur: String?,
    @Column(name ="source")
    var source: String?,
    @Column(name ="observation")
    var observation: String?,
    @Column(name ="thematique")
    var thematique: String?,
    @Column(name ="echelle")
    var echelle: String?,
    @Column(name ="date")
    var date: String?,
    @Column(name ="duree_validite")
    var duree_validite: String?,
    @Column(name ="date_fin")
    var date_fin: String?,
    @Column(name ="temporalite")
    var temporalite: String?,
    @Column(name ="objet")
    var objet: String?,
    @Column(name ="signataire")
    var signataire: String?
) {
    fun toRegulatoryArea(): RegulatoryAreaEntity {
      println("-------ID-------")
      println(id)
      println(geom)

      println("-------ID-------")
      return RegulatoryAreaEntity(
        id = id,
        //geom = geom,
        //geom = null,
        entity_name = entity_name,
        url = url,
        layer_name = layer_name,
        facade = facade,
        ref_reg = ref_reg,
        edition = edition,
        editeur = editeur,
        source = source,
        observation = observation,
        thematique = thematique,
        echelle = echelle,
        date = date,
        duree_validite = duree_validite,
        date_fin = date_fin,
        temporalite = temporalite,
        objet = objet,
        signataire = signataire
      )
    }
}
