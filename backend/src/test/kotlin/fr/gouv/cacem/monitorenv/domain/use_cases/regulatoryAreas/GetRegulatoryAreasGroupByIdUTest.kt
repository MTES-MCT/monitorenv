package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryAreaGroupDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock

class GetRegulatoryAreasGroupByIdUTest {
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository = mock()
    private val getRegulatoryAreasGroupById = GetRegulatoryAreasGroupById(regulatoryAreaGroupRepository)

    @Test
    fun `execute should return regulatory area group by its id`() {
        // Given
        val id = 1
        val expectedRegulatoryAreaGroupDTO = aRegulatoryAreaGroupDTO()
        given(regulatoryAreaGroupRepository.findGroupById(id)).willReturn(expectedRegulatoryAreaGroupDTO)

        // When
        val regulatoryAreaGroupDTO = getRegulatoryAreasGroupById.execute(id)

        // Then
        assertThat(regulatoryAreaGroupDTO).isEqualTo(expectedRegulatoryAreaGroupDTO)
    }

    @Test
    fun `execute should throw BackendUsageException when group does not exist`() {
        // Given
        val id = 1
        given(regulatoryAreaGroupRepository.findGroupById(id)).willReturn(null)

        // When
        val backendUsageException =
            assertThrows<BackendUsageException> {
                getRegulatoryAreasGroupById.execute(id)
            }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
        assertThat(backendUsageException.message).isEqualTo("regulatory area group $id not found")
    }
}
