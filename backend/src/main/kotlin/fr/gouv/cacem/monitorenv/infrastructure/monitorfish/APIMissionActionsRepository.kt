package fr.gouv.cacem.monitorenv.infrastructure.monitorfish

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.MonitorfishProperties
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.FishAction
import fr.gouv.cacem.monitorenv.domain.repositories.IFishMissionActionsRepository
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository

@Repository
class APIMissionActionsRepository(
    val apiClient: ApiClient,
    val monitorfishProperties: MonitorfishProperties,
) : IFishMissionActionsRepository {
    private val logger: Logger = LoggerFactory.getLogger(APIMissionActionsRepository::class.java)

    override fun findFishMissionActionsById(missionId: Int): List<FishAction> {
        val missionActionsUrl = "${monitorfishProperties.url}/api/v1/mission_actions?missionId=$missionId"

        return runBlocking {
            try {
                val missionActions = apiClient.httpClient.get(missionActionsUrl).body<List<FishAction>>()
                logger.info("Fetched ${missionActions.size}.")

                return@runBlocking missionActions
            } catch (e: Exception) {
                logger.error("Could not fetch mission actions at $missionActionsUrl", e)

                return@runBlocking listOf()
            }
        }
    }
}
