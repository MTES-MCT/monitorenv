package fr.gouv.cacem.monitorenv.domain.repositories

import org.locationtech.jts.geom.MultiPolygon

interface IFacadeAreasRepository {
    fun findFacadeFromMission(missionGeometry: MultiPolygon): String?
}
