package fr.gouv.cacem.monitorenv.domain.entities.mission

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class EnvActionControlEntity(
    override val id: UUID,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val geom: Geometry? = null,
    override val facade: String? = null,
    override val department: String? = null,
    override val isAdministrativeControl: Boolean? = null,
    override val isComplianceWithWaterRegulationsControl: Boolean? = null,
    override val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    override val isSeafarersControl: Boolean? = null,
    val themes: List<ThemeEntity>? = listOf(),
    val observations: String? = null,
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
) : EnvActionEntity(
    id = id,
    actionType = ActionTypeEnum.CONTROL,
)
