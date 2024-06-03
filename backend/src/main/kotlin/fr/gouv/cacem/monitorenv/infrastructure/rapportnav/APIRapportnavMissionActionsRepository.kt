package fr.gouv.cacem.monitorenv.infrastructure.rapportnav

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.RapportnavProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository

@Repository
class APIRapportnavMissionActionsRepository(
    val apiClient: ApiClient,
    val rapportnavProperties: RapportnavProperties,
) : IRapportNavMissionActionsRepository {
    private val logger: Logger = LoggerFactory.getLogger(APIRapportnavMissionActionsRepository::class.java)

    override fun findRapportnavMissionActionsById(missionId: Int): RapportNavMissionActionEntity {
        val missionActionsUrl =
            "${rapportnavProperties.url}/api/v1/missions/$missionId"

        return runBlocking {
            try {
                val rapportNavMissionActions =
                    apiClient
                        .httpClient
                        .get(missionActionsUrl)
                        .body<RapportNavMissionActionEntity>()
                logger.info("Fetched is mission has actions and the result is : $rapportNavMissionActions")

                return@runBlocking rapportNavMissionActions
            } catch (e: Exception) {
                logger.error("Could not fetch mission actions from rapportNav at $missionActionsUrl", e)

                throw NoSuchElementException()
            }
        }
    }
}
