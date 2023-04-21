package fr.gouv.cacem.monitorenv.domain.repositories

import org.locationtech.jts.geom.MultiPolygon
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSeaFrontEnum

interface IFacadeAreasRepository {
    fun findFacadeFromMission(missionGeometry: MultiPolygon): MissionSeaFrontEnum?
}
