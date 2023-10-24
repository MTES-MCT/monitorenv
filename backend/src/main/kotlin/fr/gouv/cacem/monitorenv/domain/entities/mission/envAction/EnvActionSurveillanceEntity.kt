package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    val coverMissionZone: Boolean? = null,
    override val department: String? = null,
    override val facade: String? = null,
    override val geom: Geometry? = null,
    val observations: String? = null,
    val themes: List<ThemeEntity>? = listOf(),
) :
    EnvActionEntity(
        actionType = ActionTypeEnum.SURVEILLANCE,
        id = id,
    )
