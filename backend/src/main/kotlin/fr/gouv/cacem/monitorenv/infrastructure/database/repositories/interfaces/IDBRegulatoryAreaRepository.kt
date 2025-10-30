package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaRepository : JpaRepository<RegulatoryAreaModel, Int> {
    @Query(
        value = """
        SELECT
          r.id,
          r.date,
          r.date_fin,
          r.duree_validite,
          r.editeur,
          r.edition,
          r.entity_name,
          r.facade,
          CASE
            WHEN :withGeometry IS FALSE THEN NULL
            WHEN :withGeometry IS TRUE AND (:zoom IS NULL OR :zoom >= 14) THEN
            r.geom
            WHEN :withGeometry IS TRUE AND :zoom < 14 THEN
            ST_Multi(
                ST_CollectionExtract(
                    ST_MakeValid(
                        ST_SimplifyPreserveTopology(
                            r.geom,
                            CASE
                              WHEN :zoom <= 5 THEN 0.01
                              WHEN :zoom <= 7 THEN 0.05
                              WHEN :zoom <= 11 THEN 0.001
                              ELSE 0.0001
                            END
                          )
                    ), 3)
              )
            END as geom,
          r.layer_name,
          r.observation,
          r.ref_reg,
          r.source,
          r.temporalite,
          r.type,
          r.url
        FROM regulations_cacem r
        WHERE
            (:withGeometry IS FALSE OR :minX IS NULL OR :minY IS NULL OR :maxX IS NULL OR :maxY IS NULL)
            OR ST_Intersects(r.geom, ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326))
            ORDER BY r.layer_name
    """,
        nativeQuery = true,
    )
    fun findAllByOrderByLayerName(
        zoom: Int?,
        minX: Double?,
        minY: Double?,
        maxX: Double?,
        maxY: Double?,
        withGeometry: Boolean,
    ): List<RegulatoryAreaModel>

    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>
}
