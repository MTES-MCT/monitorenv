package fr.gouv.cacem.monitorenv.infrastructure.monitorfish

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.MonitorfishProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters.MonitorFishMissionActionDataInput
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository

@Repository
class APIFishMissionActionsRepository(
    val apiClient: ApiClient,
    val monitorfishProperties: MonitorfishProperties,
) : IMonitorFishMissionActionsRepository {
    private val logger: Logger = LoggerFactory.getLogger(APIFishMissionActionsRepository::class.java)

    override fun findFishMissionActionsById(missionId: Int): List<MonitorFishMissionActionEntity> {
        val missionActionsUrl =
            "${monitorfishProperties.url}/api/v1/mission_actions?missionId=$missionId"

        return runBlocking {
            try {
                val missionActions =
                    apiClient
                        .httpClient
                        .get(missionActionsUrl) {
                            headers {
                                append("x-api-key", monitorfishProperties.xApiKey)
                            }
                        }.body<List<MonitorFishMissionActionDataInput>>()
                logger.info("Fetched ${missionActions.size} mission actions.")

                return@runBlocking missionActions.map { it.toMonitorFishMissionActionEntity() }
            } catch (e: Exception) {
                logger.error("Could not fetch mission actions at $missionActionsUrl", e)

                throw NoSuchElementException()
            }
        }
    }
}
