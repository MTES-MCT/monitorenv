package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.*

data class MissionEnvActionControlInfractionDataInput(
    val id: String,
    val administrativeResponse: AdministrativeResponseEnum,
    val companyName: String? = null,
    val controlledPersonIdentity: String? = null,
    val formalNotice: FormalNoticeEnum,
    val imo: String? = null,
    val infractionType: InfractionTypeEnum,
    val mmsi: String? = null,
    val natinf: List<String>? = listOf(),
    val nbTarget: Int,
    val observations: String? = null,
    val registrationNumber: String? = null,
    val seizure: SeizureTypeEnum,
    val vesselName: String? = null,
    val vesselType: VesselTypeEnum? = null,
    val vesselSize: Number? = null,
) {
    fun toInfractionEntity() =
        InfractionEntity(
            id = id,
            administrativeResponse = administrativeResponse,
            companyName = companyName,
            controlledPersonIdentity = controlledPersonIdentity,
            formalNotice = formalNotice,
            imo = imo,
            infractionType = infractionType,
            mmsi = mmsi,
            natinf = natinf,
            nbTarget = nbTarget,
            observations = observations,
            registrationNumber = registrationNumber,
            seizure = seizure,
            vesselName = vesselName,
            vesselType = vesselType,
            vesselSize = vesselSize,
        )
}
