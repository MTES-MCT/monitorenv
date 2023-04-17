package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.FacadeAreasModel
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSeaFrontEnum
import org.locationtech.jts.geom.MultiPolygon
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBFacadeAreasRepository : CrudRepository<FacadeAreasModel, Int> {
    @Query(
        """
       SELECT facade FROM facade_areas_subdivided 
          WHERE st_intersects(geometry, st_setsrid(:missionGeometry, 4326))
          LIMIT 1
     """,
        nativeQuery = true
    )
    fun findFacadeFromMission(missionGeometry: MultiPolygon): MissionSeaFrontEnum
?
}
