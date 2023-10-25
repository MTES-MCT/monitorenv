package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

abstract class MissionEnvActionDataOutput(
    open val id: UUID,
    open val actionEndDateTimeUtc: ZonedDateTime? = null,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
    open val department: String? = null,
    open val facade: String? = null,
    open val geom: Geometry? = null,
)
