package fr.gouv.cacem.monitorenv.domain.use_cases.base

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CanDeleteBaseUTests {
    @MockBean
    private lateinit var baseRepository: IBaseRepository

    @Test
    fun `execute should return true when control unit resources are empty`() {
        val baseId = 1
        val fullBase = FullBaseDTO(
            base = BaseEntity(
                id = 1,
                latitude = 0.0,
                longitude = 0.0,
                name = "Base Name"
            ),
            controlUnitResources = listOf()
        )

        given(baseRepository.findById(baseId)).willReturn(fullBase)

        val result = CanDeleteBase(baseRepository).execute(baseId)

        assertThat(result).isTrue
    }

    @Test
    fun `execute should return false when control unit resources are not empty`() {
        val baseId = 1
        val fullBase = FullBaseDTO(
            base = BaseEntity(
                id = 1,
                latitude = 0.0,
                longitude = 0.0,
                name = "Base Name"
            ),
            controlUnitResources = listOf(
                ControlUnitResourceEntity(
                    id = 0,
                    baseId = 1,
                    controlUnitId = 0,
                    isArchived = false,
                    name = "Control Unit Resource Name",
                    note = null,
                    photo = null,
                    type = ControlUnitResourceType.BARGE

                )
            )
        )

        given(baseRepository.findById(baseId)).willReturn(fullBase)

        val result = CanDeleteBase(baseRepository).execute(baseId)

        assertThat(result).isFalse
    }
}
