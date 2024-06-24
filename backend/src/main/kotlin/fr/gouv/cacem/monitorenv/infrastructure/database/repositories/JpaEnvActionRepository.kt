package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaEnvActionRepository(
    private val idbEnvActionRepository: IDBEnvActionRepository,
    private val idbMissionRepository: IDBMissionRepository,
    private val objectMapper: ObjectMapper,
) : IEnvActionRepository {
    override fun findById(id: UUID): EnvActionEntity? {
        return idbEnvActionRepository.findByIdOrNull(id)?.toActionEntity(objectMapper)
    }

    override fun save(envAction: EnvActionEntity): EnvActionEntity {
        envAction.missionId?.let {
            val mission = idbMissionRepository.getReferenceById(it)
            return idbEnvActionRepository.save(
                EnvActionModel.fromEnvActionEntity(
                    envAction,
                    mission = mission,
                    controlPlanThemesReferenceModelMap = mapOf(),
                    controlPlanTagsReferenceModelMap = mapOf(),
                    controlPlanSubThemesReferenceModelMap = mapOf(),
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
