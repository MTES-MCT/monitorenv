package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces


import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.springframework.data.repository.CrudRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaRepository : CrudRepository<RegulatoryAreaModel, Int> {
  @Query(
    "select id, st_asbinary(geom) geom, entity_name, url, layer_name, facade, ref_reg, edition, editeur, source, observation, thematique, echelle, date, duree_validite, date_fin, temporalite, objet, signataire from regulations_cacem ",
    nativeQuery = true)
  fun findTest(): List<RegulatoryAreaModel>
}
