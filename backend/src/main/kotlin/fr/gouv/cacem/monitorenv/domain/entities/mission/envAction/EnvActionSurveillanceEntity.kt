package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val geom: Geometry? = null,
    override val facade: String? = null,
    override val department: String? = null,
    val themes: List<ThemeEntity>? = listOf(),
    val observations: String? = null,
    val coverMissionZone: Boolean? = null
) :
    EnvActionEntity(
        actionType = ActionTypeEnum.SURVEILLANCE,
        id = id
    )
