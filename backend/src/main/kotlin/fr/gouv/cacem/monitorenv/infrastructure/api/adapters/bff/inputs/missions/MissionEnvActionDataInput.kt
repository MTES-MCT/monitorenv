package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class MissionEnvActionDataInput(
    val id: UUID,
    val actionType: ActionTypeEnum,
    val actionStartDateTimeUtc: ZonedDateTime,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,

    // Common to all action Types
    val observations: String? = null,

    // EnvActionControl + EnvSurveillance Properties
    val themes: List<ThemeEntity>? = null,

    // EnvActionControl Properties
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<MissionEnvActionControlInfractionDataInput>? = listOf(),

    // EnvActionSurveillance Properties
    val coverMissionZone: Boolean? = null,

    // complementary properties
    val reportingIds: List<Int>,
) {
    fun toEnvActionEntity(): EnvActionEntity {
        when (this.actionType) {
            ActionTypeEnum.CONTROL -> return EnvActionControlEntity(
                id = this.id,
                actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                department = this.department,
                facade = this.facade,
                geom = this.geom,
                themes = this.themes,
                actionNumberOfControls = this.actionNumberOfControls,
                actionTargetType = this.actionTargetType,
                vehicleType = this.vehicleType,
                infractions = this.infractions?.map { it.toInfractionEntity() },
                observations = this.observations,
            )
            ActionTypeEnum.SURVEILLANCE -> return EnvActionSurveillanceEntity(
                id = this.id,
                actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                department = this.department,
                facade = this.facade,
                geom = this.geom,
                themes = this.themes,
                coverMissionZone = this.coverMissionZone,
                observations = this.observations,
            )
            ActionTypeEnum.NOTE -> return EnvActionNoteEntity(
                id = this.id,
                actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                observations = this.observations,
            )
            else -> throw Exception("Action type not supported")
        }
    }
}
