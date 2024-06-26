package fr.gouv.cacem.monitorenv.infrastructure.rapportnav

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.RapportnavProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import java.net.http.HttpTimeoutException

@Repository
class APIRapportNavMissionActionsRepository(
    val apiClient: ApiClient,
    val rapportnavProperties: RapportnavProperties,
) : IRapportNavMissionActionsRepository {
    private val logger: Logger = LoggerFactory.getLogger(APIRapportNavMissionActionsRepository::class.java)

    override fun findRapportNavMissionActionsById(missionId: Int): RapportNavMissionActionEntity {
        val missionActionsUrl =
            "${rapportnavProperties.url}/api/v1/missions/$missionId"

        return runBlocking {
            withTimeout(rapportnavProperties.timeout) {
                try {
                    val rapportNavMissionActions =
                        apiClient
                            .httpClient
                            .get(missionActionsUrl)
                            .body<RapportNavMissionActionEntity>()
                    logger.info(
                        "Fetched is mission has actions and the result is : $rapportNavMissionActions",
                    )

                    return@withTimeout rapportNavMissionActions
                } catch (e: CancellationException) {
                    logger.error("Timeout while fetching rapportNav $missionActionsUrl", e)
                    throw HttpTimeoutException(e.message)
                } catch (e: Exception) {
                    logger.error(
                        "Could not fetch mission actions from rapportNav at $missionActionsUrl",
                        e,
                    )

                    throw NoSuchElementException(
                        "Could not fetch mission actions from rapportNav at $missionActionsUrl",
                    )
                }
            }
        }
    }
}
