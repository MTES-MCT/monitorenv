package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetDepartmentAreasUTests {
    @MockBean
    private lateinit var departmentAreaRepository: IDepartmentAreaRepository

    @Test
    fun `execute should return all department areas`() {
        val departmentAreas =
            listOf(
                DepartmentAreaEntity(
                    inseeCode = "1",
                    geometry = null,
                    name = "DepartmentArea Name",
                ),
                DepartmentAreaEntity(
                    inseeCode = "2",
                    geometry = null,
                    name = "DepartmentArea Name 2",
                ),
            )

        given(departmentAreaRepository.findAll()).willReturn(departmentAreas)

        val result = GetDepartmentAreas(departmentAreaRepository).execute()

        assertThat(result.size).isEqualTo(2)
        assertThat(result).isEqualTo(departmentAreas)
    }
}
