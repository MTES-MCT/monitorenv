package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaNewRepository : JpaRepository<RegulatoryAreaNewModel, Int> {
    @Query(
        value =
            """
            SELECT DISTINCT regulatoryArea,
            CASE
                WHEN :withGeometry IS FALSE THEN NULL
                WHEN :withGeometry IS TRUE AND (:zoom IS NULL OR :zoom >= 14) THEN
                regulatoryArea.geom
                WHEN :withGeometry IS TRUE AND :zoom < 14 THEN
                function('ST_Multi', function( 
                    'ST_CollectionExtract', function( 
                        'ST_MakeValid',
                            function('ST_SimplifyPreserveTopology',
                                regulatoryArea.geom,
                                CASE
                                  WHEN :zoom <= 5 THEN 0.01
                                  WHEN :zoom <= 7 THEN 0.05
                                  WHEN :zoom <= 11 THEN 0.001
                                  ELSE 0.0001
                                END
                              )
                        ), 3)
                  )
                END as geom
            FROM RegulatoryAreaNewModel regulatoryArea
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
                AND
                ((:withGeometry IS FALSE OR :geom IS NULL)
                OR intersects(regulatoryArea.geom, :geom) = true)
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
        controlPlan: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
        withGeometry: Boolean,
        zoom: Int?,
        geom: Geometry?,
    ): List<RegulatoryAreaNewModel>

    fun findAllByCreationIsNull(): List<RegulatoryAreaNewModel>

    @Query(
        """
        SELECT regulatoryArea.layerName, COUNT(regulatoryArea)
        FROM RegulatoryAreaNewModel regulatoryArea
        WHERE regulatoryArea.layerName IS NOT NULL
        GROUP BY regulatoryArea.layerName
        ORDER BY regulatoryArea.layerName
    """,
    )
    fun findAllLayerNames(): List<Array<Any>>

    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaNewModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
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
    ): List<RegulatoryAreaNewModel>
}
