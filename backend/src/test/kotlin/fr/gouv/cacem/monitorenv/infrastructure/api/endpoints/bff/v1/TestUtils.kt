package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum

class TestUtils {
    companion object {
        fun getControlInfraction(): List<InfractionEntity> {
            return listOf(
                InfractionEntity(
                    id = "d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b",
                    administrativeResponse = AdministrativeResponseEnum.SANCTION,
                    natinf = listOf("27001"),
                    observations = "Observations de l'infraction",
                    registrationNumber = "AB-123-CD",
                    companyName = "Company Name",
                    relevantCourt = "LOCAL_COURT",
                    infractionType = InfractionTypeEnum.WAITING,
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
