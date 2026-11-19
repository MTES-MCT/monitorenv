package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.PROHIBITION_PERIODS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.TAGS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.THEMES
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.PropagationConflictDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock

class GetRegulatoryAreaGroupPropagationConflictsUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val getPropagationConflicts = GetRegulatoryAreaGroupPropagationConflicts(regulatoryAreaRepository)

    @Test
    fun `execute should list the regulatory areas that already have data for each field`() {
        // Given
        val area1 = aRegulatoryArea(id = 1, themes = listOf(aTheme()), tags = listOf(aTag()))
        val area2 = aRegulatoryArea(id = 2, themes = listOf(aTheme()), prohibitionPeriods = " ")
        val area3 = aRegulatoryArea(id = 3)
        // Uses the group value: not a conflict
        val area4 = aRegulatoryArea(id = 4, themes = listOf(aTheme()), inheritedFields = listOf(THEMES))
        given(regulatoryAreaRepository.findAllByIds(listOf(1, 2, 3, 4))).willReturn(listOf(area1, area2, area3, area4))

        // When
        val conflicts = getPropagationConflicts.execute(listOf(1, 2, 3, 4), listOf(THEMES, TAGS, PROHIBITION_PERIODS))

        // Then
        assertThat(conflicts).isEqualTo(
            mapOf(
                THEMES to
                    PropagationConflictDTO(
                        regulatoryAreasWithExistingData = listOf(area1, area2),
                        totalRegulatoryAreas = 4,
                    ),
                TAGS to
                    PropagationConflictDTO(regulatoryAreasWithExistingData = listOf(area1), totalRegulatoryAreas = 4),
                PROHIBITION_PERIODS to
                    PropagationConflictDTO(regulatoryAreasWithExistingData = listOf(), totalRegulatoryAreas = 4),
            ),
        )
    }

    @Test
    fun `execute should return no conflict when there is no regulatory area`() {
        // When
        val conflicts = getPropagationConflicts.execute(listOf(), listOf(THEMES))

        // Then
        assertThat(conflicts).isEqualTo(
            mapOf(
                THEMES to PropagationConflictDTO(regulatoryAreasWithExistingData = listOf(), totalRegulatoryAreas = 0),
            ),
        )
    }
}
