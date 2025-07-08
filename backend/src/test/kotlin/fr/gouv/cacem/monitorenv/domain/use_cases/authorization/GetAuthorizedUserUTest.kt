package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAuthorizedUserUTest {
    private val userAuthorizationRepository: IUserAuthorizationRepository = mock()
    private val getAuthorizedUser = GetAuthorizedUser(userAuthorizationRepository)

    @Test
    fun `execute should return authorized user`(log: CapturedOutput) {
        // Given
        val email = "test@test.com"
        val hashedEmail = hash(email)
        val isSuperUser = true
        given(userAuthorizationRepository.findByHashedEmail(hashedEmail)).willReturn(
            UserAuthorization(
                hashedEmail,
                isSuperUser,
            ),
        )

        // When
        val user = getAuthorizedUser.execute(email)

        // Then
        assertThat(user.isSuperUser).isEqualTo(isSuperUser)
        assertThat(log.out).contains("Attempt to GET user $hashedEmail")
        assertThat(log.out).contains("Found user $hashedEmail")
    }

    @Test
    fun `execute should return authorized user with default rights when it does not exist`(log: CapturedOutput) {
        // Given
        val email = "test@test.com"
        val hashedEmail = hash(email)
        given(userAuthorizationRepository.findByHashedEmail(hashedEmail)).willReturn(null)

        // When
        val user = getAuthorizedUser.execute(email)

        // Then
        assertThat(user.isSuperUser).isEqualTo(false)
        assertThat(log.out).contains("Attempt to GET user $hashedEmail")
        assertThat(log.out).contains("User $hashedEmail not found, defaulting to superUser=false")
    }
}
