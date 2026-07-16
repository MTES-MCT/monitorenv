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
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
        controlPlan: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
    ): List<RegulatoryAreaModel>

    fun findAllByCreationIsNull(): List<RegulatoryAreaModel>

    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
            AND r.areaType = 'ZONE'
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    @Query(
        value =
            """
            SELECT *
            FROM regulatory_areas regulatoryArea
            WHERE regulatoryArea.id IN (:ids)
            AND regulatoryArea.creation IS NOT NULL
            ORDER BY
                CASE WHEN :axis = 'NORTH_SOUTH' THEN ST_Y(ST_PointOnSurface(regulatoryArea.geom)) END DESC,
                CASE WHEN :axis = 'SOUTH_NORTH' THEN ST_Y(ST_PointOnSurface(regulatoryArea.geom)) END ASC,
                CASE WHEN :axis = 'WEST_EAST'   THEN ST_X(ST_PointOnSurface(regulatoryArea.geom)) END ASC,
                CASE WHEN :axis = 'EAST_WEST'   THEN ST_X(ST_PointOnSurface(regulatoryArea.geom)) END DESC,
            ST_Y(ST_PointOnSurface(regulatoryArea.geom)) DESC
        """,
        nativeQuery = true,
    )
    fun findAllCompleteByIds(
        ids: List<Int>,
        axis: String,
    ): List<RegulatoryAreaModel>

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE RegulatoryAreaModel SET layerName = :layerName, place = :place WHERE id IN (:ids)")
    fun updateGroupTypeAndPlace(
        layerName: String?,
        place: String?,
        ids: List<Int>,
    )
}
