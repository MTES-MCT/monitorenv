package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO

@UseCase
class GetRecentControlActivity(private val envActionRepository: IEnvActionRepository) {
    fun execute(): List<RecentControlsActivityListDTO> {
        return envActionRepository.getRecentControlsActivity()
    }
}
