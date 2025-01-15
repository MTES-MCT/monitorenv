package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.validators.UseCaseValidation
import fr.gouv.cacem.monitorenv.domain.validators.mission.MissionValidator
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateEnvActions(
    private val departmentRepository: IDepartmentAreaRepository,
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
    private val postgisFunctionRepository: IPostgisFunctionRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateEnvActions::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(
        @UseCaseValidation<MissionEntity>(validator = MissionValidator::class)
        mission: MissionEntity,
        envActions: List<EnvActionEntity>?,
    ): MissionEntity {
        logger.info("Attempt to CREATE or UPDATE mission ${mission.id} with envActions ${envActions?.map { it.id }}")
        val envActionsToSave =
            envActions?.map {
                when (it.actionType) {
                    ActionTypeEnum.CONTROL -> {
                        val control = it as EnvActionControlEntity
                        val normalizedControlPoint =
                            control.geom?.let { nonNullGeom ->
                                postgisFunctionRepository.normalizeGeometry(nonNullGeom)
                            }
                        control.copy(
                            geom = normalizedControlPoint,
                            facade =
                                normalizedControlPoint?.let { nonNullGeom ->
                                    facadeRepository.findFacadeFromGeometry(nonNullGeom)
                                },
                            department =
                                normalizedControlPoint?.let { nonNullGeom ->
                                    departmentRepository.findDepartmentFromGeometry(nonNullGeom)
                                },
                        )
                    }

                    ActionTypeEnum.SURVEILLANCE -> {
                        val surveillance = it as EnvActionSurveillanceEntity
                        val normalizedGeometry =
                            surveillance.geom?.let { nonNullGeom ->
                                postgisFunctionRepository.normalizeGeometry(nonNullGeom)
                            }

                        surveillance.copy(
                            geom = normalizedGeometry,
                            facade =
                                normalizedGeometry?.let { geom ->
                                    facadeRepository.findFacadeFromGeometry(geom)
                                },
                            department =
                                normalizedGeometry?.let { geom ->
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

        logger.info(
            "Mission ${savedMission.mission.id} with envActions ${envActions?.map { it.id }} created or updated",
        )

        if (savedMission.mission.id == null) {
            throw IllegalArgumentException("Mission id is null")
        }

        return savedMission.mission
    }
}
