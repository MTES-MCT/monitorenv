package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class RecentControlsActivityListDTO(
    val id: UUID,
    val actionNumberOfControls: Int?,
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val actionTargetType: ActionTargetTypeEnum?,
    val administrationIds: List<Int>,
    val controlUnitsIds: List<Int>,
    val department: String?,
    val facade: String?,
    val geom: Geometry?,
    val infractions: List<InfractionEntity>? = listOf(),
    val missionId: Int?,
    val observations: String?,
    val subThemesIds: List<Int>,
    val themesIds: List<Int>,
    val vehicleType: VehicleTypeEnum?,
)
