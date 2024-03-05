package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository

@UseCase
class CreateOrUpdateEnvActions(
    private val departmentRepository: IDepartmentAreaRepository,
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
    private val postgisFunctionRepository: IPostgisFunctionRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(
        mission: MissionEntity,
        envActions: List<EnvActionEntity>?,
    ): MissionEntity {
        val envActionsToSave =
            envActions?.map {
                when (it.actionType) {
                    ActionTypeEnum.CONTROL -> {
                        val control = it as EnvActionControlEntity
                        val normalizedControlPoint = if (control.geom != null) {
                            postgisFunctionRepository.normalizeGeometry(control.geom)
                        } else {
                            null
                        }
                        control.copy(
                            geom = normalizedControlPoint,
                            facade =
                            (normalizedControlPoint ?: mission.geom)?.let { g ->
                                facadeRepository.findFacadeFromGeometry(g)
                            },
                            department =
                            (normalizedControlPoint ?: mission.geom)?.let { g ->
                                departmentRepository.findDepartmentFromGeometry(
                                    g,
                                )
                            },
                        )
                    }
                    ActionTypeEnum.SURVEILLANCE -> {
                        val surveillance = it as EnvActionSurveillanceEntity

                        val normalizedGeometry = if (surveillance.geom != null) {
                            postgisFunctionRepository.normalizeGeometry(surveillance.geom)
                        } else {
                            null
                        }
                        val geometry = surveillance.geom ?: mission.geom

                        surveillance.copy(
                            facade =
                            geometry?.let { geom ->
                                facadeRepository.findFacadeFromGeometry(geom)
                            },
                            department =
                            geometry?.let { geom ->
                                departmentRepository.findDepartmentFromGeometry(
                                    geom,
                                )
                            },
                        )
                    }
                    ActionTypeEnum.NOTE -> {
                        (it as EnvActionNoteEntity).copy()
                    }
                }
            }

        val missionToSave =
            mission.copy(
                envActions = envActionsToSave,
            )
        val savedMission = missionRepository.save(missionToSave)

        if (savedMission.mission.id == null) {
            throw IllegalArgumentException("Mission id is null")
        }

        return savedMission.mission
    }
}
