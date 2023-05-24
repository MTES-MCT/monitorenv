package fr.gouv.cacem.monitorenv.domain.use_cases.missions // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class UpdateMission(
    private val missionRepository: IMissionRepository,
    private val facadeAreasRepository: IFacadeAreasRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(mission: MissionEntity?): MissionEntity {
        require(mission != null) {
            "No mission to update"
        }

        if (mission.geom != null) {
            val missionToSave = mission.copy(
                facade = facadeAreasRepository.findFacadeFromGeometry(mission.geom),
            )
            return missionRepository.save(missionToSave)
        }

        return missionRepository.save(mission)
    }
}
