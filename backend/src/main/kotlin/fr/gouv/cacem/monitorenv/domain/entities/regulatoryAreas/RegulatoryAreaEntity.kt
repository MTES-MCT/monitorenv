package fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas
//import org.locationtech.jts.geom.MultiPolygon
//import com.vividsolutions.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import java.time.ZonedDateTime

data class RegulatoryAreaEntity(
        val id: Int,
        //val geom: Point? = null,
        val geom: String? = null,
        val entity_name: String? = null,
        val url: String? = null,
        val layer_name: String? = null,
        val facade: String? = null,
        val ref_reg: String? = null,
        val edition: String? = null,
        val editeur: String? = null,
        val source: String? = null,
        val observation: String? = null,
        val thematique: String? = null,
        val echelle: String? = null,
        val date: String? = null,
        val duree_validite: String? = null,
        val date_fin: String? = null,
        val temporalite: String? = null,
        val objet: String? = null,
        val signataire: String? = null
        )
