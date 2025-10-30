package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AMPModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBAMPRepository : JpaRepository<AMPModel, Int> {
    @Query(
        value =
            """
        SELECT id FROM AMPModel
        WHERE ST_INTERSECTS(st_setsrid(geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    @Query(
        value = """
        SELECT
          a.id,
          a.des_desigfr,
          CASE
            WHEN :withGeometry IS FALSE THEN NULL
            WHEN :withGeometry IS TRUE AND (:zoom IS NULL OR :zoom >= 14) THEN
            a.geom
            WHEN :withGeometry IS TRUE AND :zoom < 14 THEN
            ST_Multi(
                ST_CollectionExtract(
                    ST_MakeValid(
                        ST_SimplifyPreserveTopology(
                            a.geom,
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
            a.mpa_oriname,
            a.ref_reg,
            a.mpa_type,
            a.url_legicem
        FROM amp_cacem a
        WHERE
            (:withGeometry IS FALSE OR :minX IS NULL OR :minY IS NULL OR :maxX IS NULL OR :maxY IS NULL)
            OR ST_Intersects(a.geom, ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326))
            ORDER BY a.mpa_oriname
    """,
        nativeQuery = true,
    )
    fun findAllByOrderByName(
        zoom: Int?,
        minX: Double?,
        minY: Double?,
        maxX: Double?,
        maxY: Double?,
        withGeometry: Boolean,
    ): List<AMPModel>
}
