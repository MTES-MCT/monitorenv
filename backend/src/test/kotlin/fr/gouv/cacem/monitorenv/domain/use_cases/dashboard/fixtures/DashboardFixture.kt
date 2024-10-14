package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.WKTReader
import java.util.UUID

class DashboardFixture {
    companion object {
        fun aDashboard(
            id: UUID? = null,
            name: String = "",
            comments: String = "",
            facade: String = "",
            geom: Geometry = WKTReader().read("MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"),
            amps: List<Int> = listOf(),
            regulatoryAreas: List<Int> = listOf(),
            reportings: List<Int> = listOf(),
            vigilanceAreas: List<Int> = listOf(),
            controlUnits: List<Int> = listOf(),
            inseeCode: String? = null,
        ): DashboardEntity {
            return DashboardEntity(
                id = id,
                name = name,
                geom = geom,
                comments = comments,
                createdAt = null,
                updatedAt = null,
                amps = amps,
                regulatoryAreas = regulatoryAreas,
                inseeCode = inseeCode,
                reportings = reportings,
                vigilanceAreas = vigilanceAreas,
                controlUnits = controlUnits,
                facade = facade
            )
        }
    }
}