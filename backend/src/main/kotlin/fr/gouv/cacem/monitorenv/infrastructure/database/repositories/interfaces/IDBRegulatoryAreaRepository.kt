package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaRepository : JpaRepository<RegulatoryAreaModel, Int> {
    @Query(
        value =
            """
            SELECT DISTINCT regulatoryArea
            FROM RegulatoryAreaModel regulatoryArea
            LEFT JOIN regulatoryArea.themes th
            LEFT JOIN regulatoryArea.tags tg
            WHERE (:seaFronts IS NULL OR regulatoryArea.facade IN (:seaFronts))
            AND (:themes IS NULL OR th.theme.id IN :themes)
            AND (:tags IS NULL OR tg.tag.id IN :tags)
            AND (:controlPlan IS NULL OR regulatoryArea.plan LIKE %:controlPlan%)
            AND regulatoryArea.creation IS NOT NULL
            AND (:onlyRecentsAreas IS FALSE OR (
                regulatoryArea.creation >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
                OR regulatoryArea.editionBo >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
                OR regulatoryArea.editionCacem >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
            ))
            AND (:extent IS NULL OR intersects(regulatoryArea.geom, :extent) = true)
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
        controlPlan: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
        extent: Geometry? = null,
    ): List<RegulatoryAreaModel>

    @Query(
        value =
            """
            SELECT ST_AsMVT(tile, 'REGULATORY_ENV_PREVIEW', 4096, 'geom')
            FROM (
                SELECT
                    reg.id                                          AS "id",
                    CONCAT('REGULATORY_ENV_PREVIEW:', reg.id)       AS "uid",
                    reg.area                                        AS "area",
                    reg.poly_name                                   AS "polyName",
                    reg.layer_name                                  AS "layerName",
                    reg.location                                    AS "location",
                    reg.resume                                      AS "resume",
                    reg.plan                                        AS "plan",
                    g.geom                                          AS "geom",
                    (SELECT STRING_AGG(DISTINCT
                                CASE WHEN subtag.id IS NOT NULL
                                     THEN t.name || ', ' || subtag.name
                                     ELSE t.name END, ',')
                       FROM tags_regulatory_areas tr
                       JOIN tags t ON t.id = tr.tags_id
                       LEFT JOIN tags subtag ON subtag.parent_id = t.id
                      WHERE tr.regulatory_areas_id = reg.id)        AS "tags",
                    true                                            AS "isFilled"
                FROM regulatory_areas reg
                CROSS JOIN LATERAL (
                    SELECT ST_AsMVTGeom(
                               ST_Simplify(reg.geom_3857, 156543.03 / power(2, CAST(:z AS int)) / 4),  
                               ST_TileEnvelope(:z, :x, :y),                                            
                               4096, 64, true) AS geom
                    OFFSET 0
                ) g
                WHERE reg.geom_3857 && ST_TileEnvelope(:z, :x, :y)                                     
                  AND reg.area_type = 'ZONE'
                  AND g.geom IS NOT NULL
            
                  AND (CAST(:seaFronts AS text[]) IS NULL OR reg.facade = ANY(CAST(:seaFronts AS text[])))
                  AND (:controlPlan IS NULL OR reg.plan LIKE CONCAT('%', :controlPlan, '%'))
            
                  AND (CAST(:themes AS int[]) IS NULL OR EXISTS (
                        SELECT 1 FROM themes_regulatory_areas thr
                         WHERE thr.regulatory_areas_id = reg.id
                           AND thr.themes_id = ANY(CAST(:themes AS int[]))))
            
                  AND (CAST(:tags AS int[]) IS NULL OR EXISTS (
                        SELECT 1 FROM tags_regulatory_areas tr2
                         WHERE tr2.regulatory_areas_id = reg.id
                           AND tr2.tags_id = ANY(CAST(:tags AS int[]))))
            
                  AND (:query IS NULL
                       OR UNACCENT(UPPER(reg.poly_name))  LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                       OR UNACCENT(UPPER(reg.layer_name)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                       OR UNACCENT(UPPER(reg.ref_reg))    LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                       OR UNACCENT(UPPER(reg.resume))     LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%'))
            
                  AND (:onlyRecentsAreas IS FALSE OR (
                        reg.creation      >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                     OR reg.edition_bo    >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                     OR reg.edition_cacem >= CURRENT_TIMESTAMP - INTERVAL '30 days'))
            
                  AND ((:minX IS NULL OR :minY IS NULL OR :maxX IS NULL OR :maxY IS NULL)
                       OR ST_Intersects(reg.geom_3857, ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 3857)))
            ) AS tile;
        """,
        nativeQuery = true,
    )
    fun findAllAsTiles(
        controlPlan: String? = null,
        seaFronts: Array<String>? = null,
        tags: Array<Int>? = null,
        themes: Array<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
        query: String? = null,
        minX: Double? = null,
        minY: Double? = null,
        maxX: Double? = null,
        maxY: Double? = null,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray

    fun findAllByCreationIsNull(): List<RegulatoryAreaModel>

    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
            AND r.areaType = 'ZONE' ORDER BY r.id
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        "UPDATE RegulatoryAreaModel SET layerName = :layerName, location = :location, editionBo = CURRENT_TIMESTAMP WHERE id IN (:ids)",
    )
    fun updateLayerNameAndLocationByIds(
        layerName: String?,
        location: String?,
        ids: List<Int>,
    )

    @Query("SELECT GREATEST(COALESCE(MAX(id), 0) + 1, 1000000) from RegulatoryAreaModel")
    fun findNextId(): Int

    @Query(
        value =
            """
            SELECT regulatoryArea from RegulatoryAreaModel regulatoryArea
            WHERE regulatoryArea.layerName = :layerName
                AND regulatoryArea.location = :location
                AND regulatoryArea.areaType = 'GROUP'
                AND regulatoryArea.creation IS NOT NULL
        """,
    )
    fun findAllGroupByLayerNameAndLocation(
        layerName: String,
        location: String,
    ): List<RegulatoryAreaModel>
}
