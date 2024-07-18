package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction

import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum

data class InfractionEntity(
    val id: String,
    val administrativeResponse: AdministrativeResponseEnum?,
    val natinf: List<String>? = listOf(),
    val observations: String? = null,
    val registrationNumber: String? = null,
    val companyName: String? = null,
    val relevantCourt: String? = null,
    val imo: String? = null,
    val infractionType: InfractionTypeEnum,
    val formalNotice: FormalNoticeEnum,
    val mmsi: String? = null,
    val toProcess: Boolean,
    val controlledPersonIdentity: String? = null,
    val vesselName: String? = null,
    val vesselType: VesselTypeEnum? = null,
    val vesselSize: Number? = null,
)
