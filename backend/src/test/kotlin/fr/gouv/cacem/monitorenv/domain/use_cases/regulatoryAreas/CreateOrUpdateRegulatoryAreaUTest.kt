package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateRegulatoryAreaUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val createOrUpdateRegulatoryArea = CreateOrUpdateRegulatoryArea(regulatoryAreaRepository)

    @Test
    fun `execute should save a new regulatory area successfully`(log: CapturedOutput) {
        // Given
        val newRegulatoryArea = RegulatoryAreaFixture.aRegulatoryArea(id = 1)
        val savedRegulatoryArea = RegulatoryAreaFixture.aRegulatoryArea(id = 1)
        given(regulatoryAreaRepository.save(newRegulatoryArea)).willReturn(savedRegulatoryArea)

        // When
        val result = createOrUpdateRegulatoryArea.execute(newRegulatoryArea)

        // Then
        assertThat(result).isEqualTo(savedRegulatoryArea)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE regulatory area 1")
        assertThat(log.out).contains("Regulatory Area 1 created or updated")
    }

    @Test
    fun `execute should throw exception when save fails`(log: CapturedOutput) {
        // Given
        val regulatoryArea = RegulatoryAreaFixture.aRegulatoryArea(id = 1)
        val exceptionMessage = "Regulatory Area 1 couldn't be saved"
        given(regulatoryAreaRepository.save(regulatoryArea)).willThrow(RuntimeException(exceptionMessage))

        // When
        val thrownException =
            org.junit.jupiter.api.assertThrows<RuntimeException> {
                createOrUpdateRegulatoryArea.execute(regulatoryArea)
            }

        // Then
        assertThat(thrownException.message).isEqualTo(exceptionMessage)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE regulatory area 1")
        assertThat(log.out).contains(exceptionMessage)
    }
}
