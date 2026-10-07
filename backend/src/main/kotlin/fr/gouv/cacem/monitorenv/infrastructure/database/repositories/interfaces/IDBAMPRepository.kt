package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AMPModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBAMPRepository : JpaRepository<AMPModel, Int> {
    @Query(
        value =
            """
            SELECT DISTINCT amp
            FROM AMPModel amp
            WHERE (:onlyRecentsAreas IS FALSE OR
                CAST(amp.updatedAt as timestamp) >= DATEADD(DAY, -30, CURRENT_TIMESTAMP))
            AND (:extent IS NULL OR intersects(amp.geom, :extent) = true)
            ORDER BY amp.name
        """,
    )
    fun findAll(
        onlyRecentsAreas: Boolean? = false,
        extent: Geometry? = null,
    ): List<AMPModel>

    @Query(
        value =
            """
            SELECT ST_AsMVT(tile, 'AMP_PREVIEW', 4096, 'geom')
            FROM (
                WITH filtered_amps AS (
                    SELECT amp.id, amp.geom_3857, amp.mpa_oriname, amp.des_desigfr, amp.mpa_type,
                    amp.ref_reg, amp.url_legicem, amp.updated_at, amp.area AS "area"
                    FROM amp_cacem amp
                    WHERE geom_3857 && ST_TileEnvelope(:z, :x, :y)
                    AND (:query IS NULL 
                        OR UNACCENT(UPPER(mpa_oriname)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                        OR UNACCENT(UPPER(mpa_type)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                        )
                    AND (:onlyRecentsAreas IS FALSE OR (
                        (CAST(amp.updated_at as timestamp)) >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                        )
                    )
                    AND ((:minX IS NULL OR :minY IS NULL OR :maxX IS NULL OR :maxY IS NULL)
                        OR ST_Intersects(geom_3857, ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 3857))
                        )
                    )
                SELECT
                    filtered_amps.id as id,
                    CONCAT('AMP_PREVIEW:', filtered_amps.id) as uid,
                    filtered_amps.area,
                    filtered_amps.mpa_oriname AS "name",
                    filtered_amps.des_desigfr AS "designation",
                    filtered_amps.mpa_type AS "type",
                    filtered_amps.ref_reg as "refReg",
                    filtered_amps.url_legicem as "urlLegicem",
                    filtered_amps.updated_at as "updatedAt",
                    ST_AsMVTGeom(filtered_amps.geom_3857, ST_TileEnvelope(:z, :x, :y), 4096, 64, true) AS geom,
                    true AS "isFilled"
                FROM filtered_amps
            ) AS tile
            WHERE geom IS NOT NULL
        """,
        nativeQuery = true,
    )
    fun findAllAsTiles(
        query: String? = null,
        onlyRecentsAreas: Boolean? = null,
        minX: Double? = null,
        minY: Double? = null,
        maxX: Double? = null,
        maxY: Double? = null,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray

    @Query(
        value =
            """
            SELECT id FROM AMPModel
            WHERE ST_INTERSECTS(st_setsrid(geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    fun findAllByOrderByName(): List<AMPModel>

    @Query(
        value =
            """
            SELECT * FROM amp_cacem amp
            WHERE amp.id IN (:ids)
            ORDER BY
                CASE WHEN :axis = 'NORTH_SOUTH' THEN ST_Y(ST_PointOnSurface(amp.geom)) END DESC,
                CASE WHEN :axis = 'SOUTH_NORTH' THEN ST_Y(ST_PointOnSurface(amp.geom)) END ASC,
                CASE WHEN :axis = 'WEST_EAST'   THEN ST_X(ST_PointOnSurface(amp.geom)) END ASC,
                CASE WHEN :axis = 'EAST_WEST'   THEN ST_X(ST_PointOnSurface(amp.geom)) END DESC,
            ST_Y(ST_PointOnSurface(amp.geom)) DESC
        """,
        nativeQuery = true,
    )
    fun findAllByIds(
        ids: List<Int>,
        axis: String,
    ): List<AMPModel>
}
