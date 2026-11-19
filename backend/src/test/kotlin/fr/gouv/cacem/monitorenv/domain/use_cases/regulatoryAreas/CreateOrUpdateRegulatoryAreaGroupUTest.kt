package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.PROHIBITION_PERIODS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.RESUME
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

    private val groupTheme = aTheme(id = 1, name = "Thème du groupe")
    private val zoneTheme = aTheme(id = 2, name = "Thème de la zone")

    private fun givenSavedGroupPropagating(vararg fields: PropagatedFieldEnum) {
        given(regulatoryAreaGroupRepository.findGroupById(1)).willReturn(
            RegulatoryAreaFixture.aRegulatoryAreaGroupDTO().let {
                it.copy(
                    group = it.group.copy(areaType = AreaTypeEnum.GROUP, propagatedFields = fields.toList()),
                )
            },
        )
    }

    private fun aGroup(vararg propagation: Pair<PropagatedFieldEnum, PropagationOptionEntity>) =
        aRegulatoryAreaGroupEntity(propagation = propagation.toMap())
            .copy(themes = listOf(groupTheme), resume = "Résumé du groupe")

    @Test
    fun `execute should save a new regulatory area successfully`(log: CapturedOutput) {
        // Given
        val newRegulatoryAreaGroup = aRegulatoryAreaGroupEntity(regulatoryAreaIds = listOf())
        val savedRegulatoryAreaGroupDTO = RegulatoryAreaFixture.aRegulatoryAreaGroupDTO()
        given(regulatoryAreaGroupRepository.save(newRegulatoryAreaGroup, listOf()))
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
        val regulatoryAreaGroup = aRegulatoryAreaGroupEntity(regulatoryAreaIds = listOf())
        given(regulatoryAreaGroupRepository.save(regulatoryAreaGroup, listOf()))
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
    fun `execute should make all regulatory areas inherit a newly enabled field when the user chose to overwrite`() {
        // Given
        givenSavedGroupPropagating()
        val group = aGroup(THEMES to PropagationOptionEntity(enabled = true, overwriteExisting = true))
        val areaWithThemes = aRegulatoryArea(id = 2, themes = listOf(zoneTheme))
        val areaWithoutThemes = aRegulatoryArea(id = 3)
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(listOf(areaWithThemes, areaWithoutThemes))

        // When
        createOrUpdateRegulatoryAreaGroup.execute(group)

        // Then
        verify(regulatoryAreaGroupRepository).save(
            group,
            listOf(
                areaWithThemes.copy(themes = listOf(groupTheme), inheritedFields = listOf(THEMES)),
                areaWithoutThemes.copy(themes = listOf(groupTheme), inheritedFields = listOf(THEMES)),
            ),
        )
    }

    @Test
    fun `execute should not change any regulatory area for a newly enabled field when the user chose not to overwrite`() {
        // Given
        givenSavedGroupPropagating()
        val group = aGroup(THEMES to PropagationOptionEntity(enabled = true, overwriteExisting = false))
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(
            listOf(aRegulatoryArea(id = 2, themes = listOf(zoneTheme)), aRegulatoryArea(id = 3)),
        )

        // When
        createOrUpdateRegulatoryAreaGroup.execute(group)

        // Then
        verify(regulatoryAreaGroupRepository).save(group, listOf())
    }

    @Test
    fun `execute should make the regulatory areas without value inherit a newly enabled field without answer`() {
        // Given
        givenSavedGroupPropagating()
        val group = aGroup(RESUME to PropagationOptionEntity(enabled = true))
        val areaWithResume = aRegulatoryArea(id = 2, resume = "Résumé de la zone")
        val areaWithoutResume = aRegulatoryArea(id = 3)
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(listOf(areaWithResume, areaWithoutResume))

        // When
        createOrUpdateRegulatoryAreaGroup.execute(group)

        // Then
        verify(regulatoryAreaGroupRepository).save(
            group,
            listOf(areaWithoutResume.copy(resume = "Résumé du groupe", inheritedFields = listOf(RESUME))),
        )
    }

    @Test
    fun `execute should update only the regulatory areas inheriting an already enabled field`() {
        // Given
        givenSavedGroupPropagating(THEMES)
        val group = aGroup(THEMES to PropagationOptionEntity(enabled = true))
        val inheritingArea = aRegulatoryArea(id = 2, themes = listOf(zoneTheme), inheritedFields = listOf(THEMES))
        // This regulatory area unchecked the group value: it keeps its own value, even empty
        val notInheritingArea = aRegulatoryArea(id = 3)
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(listOf(inheritingArea, notInheritingArea))

        // When
        createOrUpdateRegulatoryAreaGroup.execute(group)

        // Then
        verify(regulatoryAreaGroupRepository).save(group, listOf(inheritingArea.copy(themes = listOf(groupTheme))))
    }

    @Test
    fun `execute should make the regulatory areas keep the last group value when a field is disabled`() {
        // Given
        givenSavedGroupPropagating(THEMES, PROHIBITION_PERIODS)
        val group =
            aGroup(
                THEMES to PropagationOptionEntity(enabled = false),
                PROHIBITION_PERIODS to PropagationOptionEntity(enabled = true),
            )
        val inheritingArea =
            aRegulatoryArea(
                id = 2,
                themes = listOf(groupTheme),
                inheritedFields = listOf(THEMES),
            )
        given(regulatoryAreaRepository.findAllByIds(listOf(2, 3))).willReturn(listOf(inheritingArea))

        // When
        createOrUpdateRegulatoryAreaGroup.execute(group)

        // Then
        verify(regulatoryAreaGroupRepository).save(group, listOf(inheritingArea.copy(inheritedFields = listOf())))
    }
}
