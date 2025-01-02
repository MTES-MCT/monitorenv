package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class DeleteUserUTest {
    private val userAuthorizationRepository: IUserAuthorizationRepository = mock()
    private val deleteUser = DeleteUser(userAuthorizationRepository)

    @Test
    fun `execute should delete user from email`(log: CapturedOutput) {
        // Given
        val email = "test@test.com"

        // When
        deleteUser.execute(email)

        // Then
        verify(userAuthorizationRepository).delete(hash(email))
        assertThat(log.out).contains("Attempt to DELETE user $email")
        assertThat(log.out).contains("User $email deleted")
    }
}
