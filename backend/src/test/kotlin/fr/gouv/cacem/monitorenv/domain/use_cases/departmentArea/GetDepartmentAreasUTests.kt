package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class GetDepartmentAreasUTests {
    @Mock
    private val departmentAreaRepository: IDepartmentAreaRepository = mock()

    @Test
    fun `execute should return all department areas`(log: CapturedOutput) {
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

        assertThat(result).isEqualTo(departmentAreas)
        assertThat(log.out).contains("Attempt to GET all department areas")
        assertThat(log.out).contains("Found ${result.size} department areas")
    }
}
