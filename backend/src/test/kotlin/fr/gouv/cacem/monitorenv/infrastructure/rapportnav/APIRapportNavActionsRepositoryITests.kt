package fr.gouv.cacem.monitorenv.infrastructure.rapportnav

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.RapportnavProperties
import io.ktor.client.engine.mock.*
import io.ktor.http.*
import io.ktor.utils.io.*
import kotlinx.coroutines.runBlocking
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test

class APIRapportNavActionsRepositoryITests {

    @Test
    fun `findRapportNavMissionActionsById Should return an object with mission id and a boolean to true if actions have been added by controlUnit`() {
        runBlocking {
            val mockEngine = MockEngine { _ ->
                respond(
                    content = ByteReadChannel(
                        """
                            {
                                "id": 1,
                                "containsActionsAddedByUnit": true
                            }
                        """,
                    ),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json"),
                )
            }
            val apiClient = ApiClient(mockEngine)
            val rapportnavProperties = RapportnavProperties()
            rapportnavProperties.url = "http://test"

            // When
            val missionActions = APIRapportNavMissionActionsRepository(apiClient, rapportnavProperties)
                .findRapportNavMissionActionsById(1)
            Assertions.assertThat(missionActions.containsActionsAddedByUnit).isTrue()
        }
    }

    @Test
    fun `findRapportNavMissionActionsById Should return an object with mission id and a boolean to false if actions have been added by controlUnit`() {
        runBlocking {
            val mockEngine = MockEngine { _ ->
                respond(
                    content = ByteReadChannel(
                        """
                            {
                                "id": 1,
                                "containsActionsAddedByUnit": false
                            }
                        """,
                    ),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json"),
                )
            }
            val apiClient = ApiClient(mockEngine)
            val rapportnavProperties = RapportnavProperties()
            rapportnavProperties.url = "http://test"

            // When
            val missionActions = APIRapportNavMissionActionsRepository(apiClient, rapportnavProperties)
                .findRapportNavMissionActionsById(1)
            Assertions.assertThat(missionActions.containsActionsAddedByUnit).isFalse()
        }
    }
}
