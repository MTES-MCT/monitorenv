package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.io.WKTReader
import java.time.ZonedDateTime
import java.util.*

class RecentControlsActivityListDTOFixture {
    companion object {
        fun aRecentControlsActivityListDTO(): RecentControlsActivityListDTO {
            val wktReader = WKTReader()
            val multipointString = "MULTIPOINT((49.354105 -0.427455))"
            val point = wktReader.read(multipointString) as MultiPoint

            return RecentControlsActivityListDTO(
                id =
                    UUID.fromString(
                        "123e4567-e89b-12d3-a456-426614174000",
                    ),
                actionNumberOfControls = 2,
                actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                administrationIds = listOf(1),
                controlUnitsIds = listOf(1, 2),
                department = "44",
                facade = "NAMO",
                geom = point,
                infractions = listOf(),
                missionId = 99,
                observations = "observations",
                subThemesIds = listOf(10, 12),
                themesIds = listOf(8),
                vehicleType = VehicleTypeEnum.VEHICLE_AIR,
            )
        }
    }
}
