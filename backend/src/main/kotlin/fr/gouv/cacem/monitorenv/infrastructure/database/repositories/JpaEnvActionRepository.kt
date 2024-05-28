package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ConcreteEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBEnvActionRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class JpaEnvActionRepository(
    private val idbEnvActionRepository: IDBEnvActionRepository,
    private val objectMapper: ObjectMapper,
) : IEnvActionRepository {
    override fun findById(id: UUID): EnvActionEntity? {
        return idbEnvActionRepository.findByIdOrNull(id)?.toActionEntity(objectMapper)
    }

    override fun save(envAction: ConcreteEnvActionEntity): ConcreteEnvActionEntity {
        TODO("Not yet implemented")

//        idbEnvActionRepository.save(EnvActionModel.fromEnvActionEntity())
    }
}
