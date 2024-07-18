package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeSanctionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.LegalSanctionEnum

data class MissionEnvActionControlInfractionDataInput(
    val id: String,
    val administrativeSanction: AdministrativeSanctionEnum,
    val companyName: String? = null,
    val controlledPersonIdentity: String? = null,
    val formalNotice: FormalNoticeEnum,
    val imo: String? = null,
    val legalSanction: LegalSanctionEnum,
    val mmsi: String? = null,
    val natinf: List<String>? = listOf(),
    val observations: String? = null,
    val registrationNumber: String? = null,
    val relevantCourt: String? = null,
    val toProcess: Boolean,
    val vesselName: String? = null,
    val vesselType: VesselTypeEnum? = null,
    val vesselSize: Number? = null,
) {
    fun toInfractionEntity() =
        InfractionEntity(
            id = id,
            administrativeSanction = administrativeSanction,
            companyName = companyName,
            controlledPersonIdentity = controlledPersonIdentity,
            formalNotice = formalNotice,
            imo = imo,
            legalSanction = legalSanction,
            mmsi = mmsi,
            natinf = natinf,
            observations = observations,
            registrationNumber = registrationNumber,
            relevantCourt = relevantCourt,
            toProcess = toProcess,
            vesselName = vesselName,
            vesselType = vesselType,
            vesselSize = vesselSize,
        )
}
