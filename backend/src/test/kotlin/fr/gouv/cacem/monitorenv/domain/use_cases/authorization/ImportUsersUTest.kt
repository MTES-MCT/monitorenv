package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class ImportUsersUTest {
    private val userAuthorizationRepository: IUserAuthorizationRepository = mock()
    private val importUsers: ImportUsers =
        ImportUsers(userAuthorizationRepository = userAuthorizationRepository)

    @Test
    fun `execute should parse userImportFile to UserAuthorization then save them`() {
        // Given
        val users = listOf(UserAuthorization("email@email.com", true))

        // When
        val userAuthorizations = importUsers.execute(users)

        // Then
        assertThat(userAuthorizations).isEqualTo(users)
    }

    @Test
    fun `execute should return empty when users list is empty`() {
        // When
        val userAuthorizations = importUsers.execute(listOf())

        // Then
        assertThat(userAuthorizations).isEmpty()
    }
}
