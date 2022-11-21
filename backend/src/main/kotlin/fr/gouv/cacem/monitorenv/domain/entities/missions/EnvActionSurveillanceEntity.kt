package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.MultiPoint
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val geom: MultiPoint? = null,
    val actionTheme: String? = null,
    val actionSubTheme: String? = null,
    val protectedSpecies: List<String>? = listOf(),
    val duration: Double? = null,
    val observations: String? = null,
    val coverMissionZone: Boolean? = null
) : EnvActionEntity(
    actionType = ActionTypeEnum.SURVEILLANCE,
    id = id
)
