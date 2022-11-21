package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class CreateMission(
    private val missionRepository: IMissionRepository,
    private val facadeRepository: IFacadeAreasRepository
) {
    @Throws(IllegalArgumentException::class)
    fun execute(mission: MissionEntity): MissionEntity {
        if (mission.geom != null) {
            val missionToSave = mission.copy(
                facade = facadeRepository.findFacadeFromMission(mission.geom)
            )
            return missionRepository.create(missionToSave)
        }
        return missionRepository.create(mission)
    }
}
