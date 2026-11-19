package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateRegulatoryAreaUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository = mock()
    private val createOrUpdateRegulatoryArea =
        CreateOrUpdateRegulatoryArea(regulatoryAreaRepository, regulatoryAreaGroupRepository)

    private val group =
        RegulatoryAreaFixture.aRegulatoryArea(
            id = 10,
            areaType = AreaTypeEnum.GROUP,
            layerName = "Layername 1",
            themes = listOf(ThemeFixture.aTheme(id = 1)),
            resume = "résumé du groupe",
            prohibitionPeriods = "interdit l'hiver",
            propagatedFields =
                listOf(PropagatedFieldEnum.THEMES, PropagatedFieldEnum.RESUME, PropagatedFieldEnum.TAGS),
        )

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

    @Test
    fun `execute should fill the empty fields of a regulatory area joining a group with the group values`() {
        // Given
        val regulatoryArea = RegulatoryAreaFixture.aRegulatoryArea(id = 1, resume = "résumé de la zone")
        given(regulatoryAreaGroupRepository.findGroupByLayerNameAndLocation("Layername 1", null)).willReturn(group)
        given(regulatoryAreaGroupRepository.findGroupByRegulatoryAreaId(1)).willReturn(null)
        val expectedRegulatoryArea = regulatoryArea.copy(themes = group.themes)
        given(regulatoryAreaRepository.save(expectedRegulatoryArea)).willReturn(expectedRegulatoryArea)

        // When
        val result = createOrUpdateRegulatoryArea.execute(regulatoryArea)

        // Then
        // Themes are copied, the resume of the zone is kept, prohibition periods are not propagated by the group
        verify(regulatoryAreaRepository).save(expectedRegulatoryArea)
        assertThat(result).isEqualTo(expectedRegulatoryArea)
    }

    @Test
    fun `execute should not apply the group values when the regulatory area was already in the group`() {
        // Given
        val regulatoryArea = RegulatoryAreaFixture.aRegulatoryArea(id = 1)
        given(regulatoryAreaGroupRepository.findGroupByLayerNameAndLocation("Layername 1", null)).willReturn(group)
        given(regulatoryAreaGroupRepository.findGroupByRegulatoryAreaId(1)).willReturn(group)
        given(regulatoryAreaRepository.save(regulatoryArea)).willReturn(regulatoryArea)

        // When
        createOrUpdateRegulatoryArea.execute(regulatoryArea)

        // Then
        verify(regulatoryAreaRepository).save(regulatoryArea)
    }
}
