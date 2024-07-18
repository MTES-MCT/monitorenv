package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeSanctionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.LegalSanctionEnum

class TestUtils {
    companion object {
        fun getControlInfraction(): List<InfractionEntity> {
            return listOf(
                InfractionEntity(
                    id = "d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b",
                    administrativeSanction = AdministrativeSanctionEnum.SANCTION,
                    natinf = listOf("27001"),
                    observations = "Observations de l'infraction",
                    registrationNumber = "AB-123-CD",
                    companyName = "Company Name",
                    relevantCourt = "LOCAL_COURT",
                    legalSanction = LegalSanctionEnum.WAITING,
                    formalNotice = FormalNoticeEnum.NO,
                    toProcess = false,
                    controlledPersonIdentity = "Captain Flame",
                    vesselType = VesselTypeEnum.COMMERCIAL,
                    vesselSize = 23,
                    vesselName = "Vessel Name",
                    mmsi = "123456789",
                    imo = "987654321",
                ),
            )
        }
    }
}
