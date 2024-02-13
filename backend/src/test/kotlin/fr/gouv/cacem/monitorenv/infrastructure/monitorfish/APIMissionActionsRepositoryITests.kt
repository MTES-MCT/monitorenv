package fr.gouv.cacem.monitorenv.infrastructure.monitorfish

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.MonitorfishProperties
import fr.gouv.cacem.monitorenv.infrastructure.monitorfish.TestUtils.Companion.getMissionWithAction
import io.ktor.client.engine.mock.*
import io.ktor.http.*
import io.ktor.utils.io.*
import kotlinx.coroutines.runBlocking
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class APIMissionActionsRepositoryITests {

    @Test
    fun `findFishMissionActionsById Should return the mission actions with array of actions`() {
        runBlocking {
            val mockEngine = MockEngine { _ ->
                respond(
                    content = ByteReadChannel(
                        getMissionWithAction(),
                    ),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json"),
                )
            }
            val apiClient = ApiClient(mockEngine)
            val monitorfishProperties = MonitorfishProperties()
            monitorfishProperties.url = "http://test"
            monitorfishProperties.xApiKey = "TEST"

            // When
            val missionActions = APIMissionActionsRepository(apiClient, monitorfishProperties)
                .findFishMissionActionsById(1)
            assertThat(missionActions).isNotEmpty
        }
    }

    @Test
    fun `findFishMissionActionsById Should return the mission actions with empty array`() {
        runBlocking {
            val mockEngine = MockEngine { _ ->
                respond(
                    content = ByteReadChannel(
                        """[]""",
                    ),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json"),
                )
            }
            val apiClient = ApiClient(mockEngine)
            val monitorfishProperties = MonitorfishProperties()
            monitorfishProperties.url = "http://test"
            monitorfishProperties.xApiKey = "TEST"

            // When
            val missionActions = APIMissionActionsRepository(apiClient, monitorfishProperties)
                .findFishMissionActionsById(1)
            assertThat(missionActions).isEmpty()
        }
    }
}
