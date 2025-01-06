package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetDepartmentAreaByInseeCodeUTests {
    @Mock
    private val departmentAreaRepository: IDepartmentAreaRepository = mock()

    @Test
    fun `execute should return a department area by its INSEE Code`() {
        val departmentAreaId = "1"
        val departmentArea =
            DepartmentAreaEntity(
                inseeCode = "1",
                geometry = null,
                name = "Department Area Name",
            )

        given(departmentAreaRepository.findByInseeCode(departmentAreaId)).willReturn(departmentArea)

        val result = GetDepartmentAreaByInseeCode(departmentAreaRepository).execute(departmentAreaId)

        assertThat(result).isEqualTo(departmentArea)
    }
}
