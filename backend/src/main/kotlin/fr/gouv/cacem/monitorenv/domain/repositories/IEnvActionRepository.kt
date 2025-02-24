package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import java.util.*

interface IEnvActionRepository {
    fun findById(id: UUID): EnvActionEntity?

    fun save(envAction: EnvActionEntity): EnvActionEntity

    fun getRecentControlsActivity(): List<RecentControlsActivityListDTO>
}
