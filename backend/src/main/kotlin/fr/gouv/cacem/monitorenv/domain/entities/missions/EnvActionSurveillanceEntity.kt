package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val geom: Geometry? = null,
    val themes: List<ThemeEntity>? = listOf(),
    val duration: Double? = null,
    val observations: String? = null,
    val coverMissionZone: Boolean? = null,
) : EnvActionEntity(
    actionType = ActionTypeEnum.SURVEILLANCE,
    id = id,
)
