package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateRegulatoryAreaGroupUTest {
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository = mock()
    private val createOrUpdateRegulatoryAreaGroup = CreateOrUpdateRegulatoryAreaGroup(regulatoryAreaGroupRepository)

    @Test
    fun `execute should save a new regulatory area successfully`(log: CapturedOutput) {
        // Given
        val newRegulatoryAreaGroup = RegulatoryAreaFixture.aRegulatoryAreaGroupEntity()
        val savedRegulatoryAreaGroupDTO = RegulatoryAreaFixture.aRegulatoryAreaGroupDTO()
        given(regulatoryAreaGroupRepository.save(newRegulatoryAreaGroup)).willReturn(savedRegulatoryAreaGroupDTO)

        // When
        val result = createOrUpdateRegulatoryAreaGroup.execute(newRegulatoryAreaGroup)

        // Then
        assertThat(result).isEqualTo(savedRegulatoryAreaGroupDTO)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE regulatory area group Layer 1")
        assertThat(log.out).contains("Regulatory Area group Layer 1 created or updated")
    }

    @Test
    fun `execute should throw exception when save fails`(log: CapturedOutput) {
        // Given
        val regulatoryAreaGroup = RegulatoryAreaFixture.aRegulatoryAreaGroupEntity()
        val exceptionMessage = "Regulatory Area group Layer 1 couldn't be saved"
        given(regulatoryAreaGroupRepository.save(regulatoryAreaGroup)).willThrow(RuntimeException(exceptionMessage))

        // When
        val thrownException =
            org.junit.jupiter.api.assertThrows<RuntimeException> {
                createOrUpdateRegulatoryAreaGroup.execute(regulatoryAreaGroup)
            }

        // Then
        assertThat(thrownException.message).isEqualTo(exceptionMessage)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE regulatory area group Layer 1")
        assertThat(log.out).contains(exceptionMessage)
    }
}
