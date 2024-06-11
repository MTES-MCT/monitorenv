package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import java.util.UUID

interface IEnvActionRepository {
    fun findById(id: UUID): EnvActionEntity?

    fun save(envAction: EnvActionEntity): EnvActionEntity
}
