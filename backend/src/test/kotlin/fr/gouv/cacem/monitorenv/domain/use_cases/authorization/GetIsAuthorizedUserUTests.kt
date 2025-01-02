package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaUserAuthorizationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.BDDMockito.given
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class GetIsAuthorizedUserUTests {
    @Mock
    private val userAuthorizationRepository: JpaUserAuthorizationRepository = mock()

    @Test
    fun `execute Should return true When the user is found and super-user When the path is super-user protected`(
        log: CapturedOutput,
    ) {
        given(userAuthorizationRepository.findByHashedEmail(any()))
            .willReturn(
                UserAuthorization("58GE5S8VXE871FGGd2", true),
            )

        // When
        val email = "test@test.com"
        val hashedEmail = hash(email)
        val isAuthorized =
            GetIsAuthorizedUser(userAuthorizationRepository)
                .execute(
                    email,
                    true,
                )

        // Then
        assertThat(isAuthorized).isTrue
        assertThat(log.out).contains("Is user $hashedEmail AUTHORIZED")
    }

    @Test
    fun `execute Should return false When the user is found but not super-user When the path is super-user protected`() {
        given(userAuthorizationRepository.findByHashedEmail(any()))
            .willReturn(
                UserAuthorization("58GE5S8VXE871FGGd2", false),
            )

        // When
        val isAuthorized =
            GetIsAuthorizedUser(userAuthorizationRepository)
                .execute(
                    "test",
                    true,
                )

        // Then
        assertThat(isAuthorized).isFalse
    }

    @Test
    fun `execute Should return true When the path is not super-user protected`() {
        // When
        val isAuthorized =
            GetIsAuthorizedUser(userAuthorizationRepository)
                .execute(
                    "test",
                    false,
                )

        // Then
        assertThat(isAuthorized).isTrue
    }

    @Test
    fun `execute Should return false When the user is not found When the path is super-user protected`() {
        given(userAuthorizationRepository.findByHashedEmail(any())).willReturn(null)

        // When
        val isAuthorized =
            GetIsAuthorizedUser(userAuthorizationRepository)
                .execute(
                    "test",
                    true,
                )

        // Then
        assertThat(isAuthorized).isFalse
    }
}
