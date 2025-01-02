package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class SaveUserUTest {
    private val userAuthorizationRepository: IUserAuthorizationRepository = mock()
    private val saveUser = SaveUser(userAuthorizationRepository)

    @Test
    fun `execute should save user`(log: CapturedOutput) {
        // Given
        val email = hash("test@test.com")
        val isSuperUser = false
        val userAuthorization = UserAuthorization(email, isSuperUser)

        // When
        saveUser.execute(userAuthorization)

        // Then
        verify(userAuthorizationRepository).save(userAuthorization)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE user $email")
        assertThat(log.out).contains("User $email created or updated")
    }
}
