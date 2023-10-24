package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class CreateOrUpdateMissionEnvActionDataInput(
    val id: UUID,
    val actionType: ActionTypeEnum,
    val actionStartDateTimeUtc: ZonedDateTime,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val reportingIds: List<Integer>? = null,
) {
    fun toEnvActionEntity(mapper: ObjectMapper): EnvActionEntity {
        return EnvActionMapper.getEnvActionEntityFromJSON(
            mapper = mapper,
            id = this.id,
            actionType = this.actionType,
            actionStartDateTimeUtc = this.actionStartDateTimeUtc,
            actionEndDateTimeUtc = this.actionEndDateTimeUtc,
            department = this.department,
            facade = this.facade,
            geom = this.geom,
        )
    }
}
