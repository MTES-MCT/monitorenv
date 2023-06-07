package fr.gouv.cacem.monitorenv.domain.use_cases.missions // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class CreateOrUpdateMission(
    private val departmentRepository: IDepartmentAreasRepository,
    private val missionRepository: IMissionRepository,
    private val facadeRepository: IFacadeAreasRepository,

) {
    @Throws(IllegalArgumentException::class)
    fun execute(mission: MissionEntity?): MissionEntity {
        require(mission != null) {
            "No mission to create or update"
        }
        val envActions = mission.envActions?.map {
            when (it.actionType) {
                ActionTypeEnum.CONTROL -> {
                    (it as EnvActionControlEntity).copy(
                        facade = it.geom?.let { geom -> facadeRepository.findFacadeFromGeometry(geom) },
                        department= it.geom?.let { geom -> departmentRepository.findDepartmentFromGeometry(geom) }
                    )
                }
                ActionTypeEnum.SURVEILLANCE -> {
                    (it as EnvActionSurveillanceEntity).copy(
                        facade = it.geom?.let { geom -> facadeRepository.findFacadeFromGeometry(geom) },
                        department= it.geom?.let { geom -> departmentRepository.findDepartmentFromGeometry(geom) }
                    )
                }
                ActionTypeEnum.NOTE -> {
                    (it as EnvActionNoteEntity).copy()
                }
            }
        }

        var facade: String? = null

        if (mission.geom != null) {
            facade = facadeRepository.findFacadeFromGeometry(mission.geom)
        }

        val missionToSave = mission.copy(
            facade = facade,
            envActions = envActions
            )

        return missionRepository.save(missionToSave)
    }
}
