package fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity

class MissionTagFixture {
    companion object {
        fun aMissionTagEntity(id: Int? = 1): MissionTagEntity =
            MissionTagEntity(
                id = id,
                name = "test",
                isArchived = false,
            )
    }
}
