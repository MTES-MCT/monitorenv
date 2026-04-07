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
            LEFT JOIN FETCH regulatoryArea.themes th
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

    @Query(
        value = """
        SELECT
          r.id,
          r.creation,
          r.date,
          r.date_fin,
          r.duree_validite,
          r.editeur,
          r.edition_bo,
          r.edition_cacem,
          r.facade,
          CASE
            WHEN :withGeometry IS FALSE THEN NULL
            WHEN :withGeometry IS TRUE AND (:zoom IS NULL OR :zoom >= 14) THEN
            r.geom
            WHEN :withGeometry IS TRUE AND :zoom < 14 THEN
                        ST_SimplifyPreserveTopology(
                            r.geom,
                            CASE
                              WHEN :zoom <= 6 THEN 0.05
                              WHEN :zoom <= 8 THEN 0.01
                              WHEN :zoom <= 11 THEN 0.001
                              ELSE 0.0001
                            END
                          )
            END as geom,
          r.layer_name,
          r.plan,
          r.observation,
          r.poly_name,
          r.ref_reg,
          r.source,
          r.temporalite,
          r.resume,
          r.type,
          r.url,
          r.additional_ref_reg,
          r.authorization_periods,
          r.prohibition_periods
        FROM regulatory_areas r
        LEFT JOIN themes_regulatory_areas_new parent_themes ON parent_themes.regulatory_areas_id = r.id
        LEFT JOIN themes ON parent_themes.themes_id = themes.id
        LEFT JOIN themes_regulatory_areas_new subthemes_tr ON subthemes_tr.regulatory_areas_id = r.id
        LEFT JOIN themes subthemes ON subthemes_tr.themes_id = subthemes.id
        LEFT JOIN tags_regulatory_areas_new parent_tags ON parent_tags.regulatory_areas_id = r.id
        LEFT JOIN tags ON parent_tags.tags_id = tags.id
        LEFT JOIN tags_regulatory_areas_new subtags_tr ON subtags_tr.regulatory_areas_id = r.id
        LEFT JOIN tags subtags ON subtags_tr.tags_id = subtags.id
        WHERE
            (:withGeometry IS FALSE OR :minX IS NULL OR :minY IS NULL OR :maxX IS NULL OR :maxY IS NULL)
            OR ST_Intersects(r.geom, ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 4326))
            ORDER BY r.layer_name
    """,
        nativeQuery = true,
    )
    fun findAll2(
        zoom: Int?,
        minX: Double?,
        minY: Double?,
        maxX: Double?,
        maxY: Double?,
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
