package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.AUTHORIZATION_PERIODS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.RESUME
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.TAGS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.THEMES
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagationOptionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.verifyNoInteractions
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateRegulatoryAreaGroupUTest {
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository = mock()
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val createOrUpdateRegulatoryAreaGroup =
        CreateOrUpdateRegulatoryAreaGroup(regulatoryAreaGroupRepository, regulatoryAreaRepository)

    @Test
    fun `execute should save a new regulatory area successfully`(log: CapturedOutput) {
        // Given
        val newRegulatoryAreaGroup = aRegulatoryAreaGroupEntity()
        val savedRegulatoryAreaGroupDTO = RegulatoryAreaFixture.aRegulatoryAreaGroupDTO()
        given(regulatoryAreaGroupRepository.save(newRegulatoryAreaGroup, emptySet()))
            .willReturn(savedRegulatoryAreaGroupDTO)

        // When
        val result = createOrUpdateRegulatoryAreaGroup.execute(newRegulatoryAreaGroup)

        // Then
        assertThat(result).isEqualTo(savedRegulatoryAreaGroupDTO)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE regulatory area group Layer 1")
        assertThat(log.out).contains("Regulatory Area group Layer 1 created or updated")
        verifyNoInteractions(regulatoryAreaRepository)
    }

    @Test
    fun `execute should throw exception when save fails`(log: CapturedOutput) {
        // Given
        val regulatoryAreaGroup = aRegulatoryAreaGroupEntity()
        given(regulatoryAreaGroupRepository.save(regulatoryAreaGroup, emptySet()))
            .willThrow(RuntimeException("error"))

        // When
        val thrownException =
            assertThrows<BackendUsageException> {
                createOrUpdateRegulatoryAreaGroup.execute(regulatoryAreaGroup)
            }

        // Then
        assertThat(thrownException.message).isEqualTo("Regulatory Area group Layer 1 couldn't be saved")
        assertThat(log.out).contains("Attempt to CREATE or UPDATE regulatory area group Layer 1")
    }

    @Test
    fun `execute should copy the fields that the user chose to overwrite`() {
        // Given
        val regulatoryAreaGroup =
            aRegulatoryAreaGroupEntity(
                propagation =
                    mapOf(
                        THEMES to PropagationOptionEntity(enabled = true, overwriteExisting = true),
                        RESUME to PropagationOptionEntity(enabled = true, overwriteExisting = false),
                        TAGS to PropagationOptionEntity(enabled = false, overwriteExisting = true),
                    ),
            )
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(
            listOf(
                aRegulatoryArea(id = 2, themes = listOf(aTheme()), resume = "résumé"),
                aRegulatoryArea(id = 3),
            ),
        )

        // When
        createOrUpdateRegulatoryAreaGroup.execute(regulatoryAreaGroup)

        // Then
        verify(regulatoryAreaGroupRepository).save(regulatoryAreaGroup, setOf(THEMES))
    }

    @Test
    fun `execute should copy a field without answer only when no regulatory area has data for it`() {
        // Given
        val regulatoryAreaGroup =
            aRegulatoryAreaGroupEntity(
                propagation =
                    mapOf(
                        RESUME to PropagationOptionEntity(enabled = true),
                        AUTHORIZATION_PERIODS to PropagationOptionEntity(enabled = true),
                    ),
            )
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(
            listOf(
                aRegulatoryArea(id = 2, resume = "résumé existant"),
                aRegulatoryArea(id = 3),
            ),
        )

        // When
        createOrUpdateRegulatoryAreaGroup.execute(regulatoryAreaGroup)

        // Then
        verify(regulatoryAreaGroupRepository).save(regulatoryAreaGroup, setOf(AUTHORIZATION_PERIODS))
    }

    @Test
    fun `execute should not read regulatory areas when the group is empty`() {
        // Given
        val regulatoryAreaGroup =
            aRegulatoryAreaGroupEntity(
                regulatoryAreaIds = listOf(),
                propagation = mapOf(THEMES to PropagationOptionEntity(enabled = true, overwriteExisting = true)),
            )

        // When
        createOrUpdateRegulatoryAreaGroup.execute(regulatoryAreaGroup)

        // Then
        verify(regulatoryAreaGroupRepository).save(regulatoryAreaGroup, emptySet())
        verifyNoInteractions(regulatoryAreaRepository)
    }
}
