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

@UseCase
class CreateOrUpdateEnvActions(
    private val departmentRepository: IDepartmentAreaRepository,
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
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
                        (it as EnvActionControlEntity).copy(
                            facade =
                            (it.geom ?: mission.geom)?.let { geom ->
                                facadeRepository.findFacadeFromGeometry(geom)
                            },
                            department =
                            (it.geom ?: mission.geom)?.let { geom ->
                                departmentRepository.findDepartmentFromGeometry(
                                    geom,
                                )
                            },
                        )
                    }
                    ActionTypeEnum.SURVEILLANCE -> {
                        val surveillance = it as EnvActionSurveillanceEntity
                        /*
                        When coverMissionZone is true, use mission geometry in priority, fall back to action geometry.
                        When coverMissionZone is not true, prioritize the other way around.
                        Ideally the fallbacks should not be needed, but if coverMissionZone is true and the mission geom
                        is null, or if coverMissionZone is false and the action geom is null, then rather that nothing,
                        better use the geometry that is available, if any.
                         */
                        val geometry =
                            if (surveillance.coverMissionZone == true) {
                                (mission.geom ?: surveillance.geom)
                            } else {
                                (surveillance.geom ?: mission.geom)
                            }
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
