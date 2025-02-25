package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.recentActivity.RecentControlActivityProperties
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanSubThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanTagModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.*
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.time.Instant
import java.time.ZonedDateTime
import java.util.*

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
            val controlPlanTagsReferenceModelMap: MutableMap<Int, ControlPlanTagModel> = mutableMapOf()
            val controlPlanSubThemesReferenceModelMap: MutableMap<Int, ControlPlanSubThemeModel> = mutableMapOf()

            envAction.controlPlans?.forEach { controlPlan ->
                controlPlan.tagIds?.forEach { tagId ->
                    controlPlanTagsReferenceModelMap[tagId] = idbControlPlanTagRepository.getReferenceById(tagId)
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
                    controlPlanTagsReferenceModelMap = controlPlanTagsReferenceModelMap,
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

    override fun getRecentControlsActivity(
        startedAfter: Instant,
        startedBefore: Instant,
        infractionsStatus: List<String>?,
        controlUnitIds: List<Int>?,
        administrationIds: List<Int>?,
    ): List<RecentControlsActivityListDTO> {
        val filteredControlUnitIds = if (controlUnitIds.isNullOrEmpty()) null else controlUnitIds
        val filteredAdministrationIds =
            if (administrationIds.isNullOrEmpty()) null else administrationIds

        return idbEnvActionRepository.getRecentControlsActivity(
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            controlUnitIds = filteredControlUnitIds,
            administrationIds = filteredAdministrationIds,
        ).map { row ->

            val valueJson = row[2] as String
            val valueObject =
                objectMapper.readValue(valueJson, RecentControlActivityProperties::class.java)

            RecentControlsActivityListDTO(
                id = row[0] as UUID,
                missionId = row[1] as Int,
                actionStartDateTimeUtc = row[3] as? ZonedDateTime,
                geom = row[4] as? Geometry,
                facade = row[5] as? String,
                department = row[6] as? String,
                themesIds = (row[7] as Array<Int>).toList(),
                subThemesIds = (row[8] as Array<Int>).toList(),
                controlUnitsIds = (row[9] as Array<Int>).toList(),
                administrationIds = (row[10] as Array<Int>).toList(),
                actionNumberOfControls = valueObject.actionNumberOfControls,
                actionTargetType = valueObject.actionTargetType,
                vehicleType = valueObject.vehicleType,
                infractions = valueObject.infractions,
                observations = valueObject.observations,
            )
        }.filter { recentControl ->
            when {
                infractionsStatus.isNullOrEmpty() -> true
                infractionsStatus.contains("WITH_INFRACTIONS") && recentControl.infractions?.isNotEmpty() == true -> true
                infractionsStatus.contains("WITHOUT_INFRACTIONS") && recentControl.infractions.isNullOrEmpty() -> true
                else -> false
            }
        }
    }
}
