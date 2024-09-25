package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanSubThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanTagModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanTagRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaEnvActionRepository(
    private val idbEnvActionRepository: IDBEnvActionRepository,
    private val idbMissionRepository: IDBMissionRepository,
    private val idbControlPlanThemeRepository: IDBControlPlanThemeRepository,
    private val idbControlPlanSubThemeRepository: IDBControlPlanSubThemeRepository,
    private val idbControlPlanTagRepository: IDBControlPlanTagRepository,
    private val objectMapper: ObjectMapper,
) : IEnvActionRepository {
    override fun findById(id: UUID): EnvActionEntity? {
        return idbEnvActionRepository.findByIdOrNull(id)?.toActionEntity(objectMapper)
    }

    override fun save(envAction: EnvActionEntity): EnvActionEntity {
        envAction.missionId?.let { missionId ->
            val mission = idbMissionRepository.getReferenceById(missionId)
            val controlPlanThemesReferenceModelMap: MutableMap<Int, ControlPlanThemeModel> = mutableMapOf()
            val controlPlanTagssReferenceModelMap: MutableMap<Int, ControlPlanTagModel> = mutableMapOf()
            val controlPlanSubThemesReferenceModelMap: MutableMap<Int, ControlPlanSubThemeModel> = mutableMapOf()


            envAction.controlPlans?.forEach { controlPlan ->
                controlPlan.tagIds?.forEach { tagId ->
                    controlPlanTagssReferenceModelMap[tagId] = idbControlPlanTagRepository.getReferenceById(tagId)
                }
                controlPlan.themeId?.let { themeId ->
                    controlPlanThemesReferenceModelMap[themeId] =
                        idbControlPlanThemeRepository.getReferenceById(themeId)
                }
                controlPlan.subThemeIds?.forEach { subthemeId ->
                    controlPlanSubThemesReferenceModelMap[subthemeId] =
                        idbControlPlanSubThemeRepository.getReferenceById(subthemeId)
                }
            }
            return idbEnvActionRepository.save(
                EnvActionModel.fromEnvActionEntity(
                    envAction,
                    mission = mission,
                    controlPlanThemesReferenceModelMap = controlPlanThemesReferenceModelMap,
                    controlPlanTagsReferenceModelMap = controlPlanTagssReferenceModelMap,
                    controlPlanSubThemesReferenceModelMap = controlPlanSubThemesReferenceModelMap,
                    mapper = objectMapper,
                ),
            ).toActionEntity(objectMapper)
        }
        throw BackendUsageException(
            BackendUsageErrorCode.ENTITY_NOT_FOUND,
            "Trying to save an envAction without mission",
        )
    }
}
