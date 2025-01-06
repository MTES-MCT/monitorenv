package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetControlUnitResourcesUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should return all control unit resources`() {
        val controlUnitResources =
            listOf(
                FullControlUnitResourceDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 1,
                            administrationId = 101,
                            areaNote = "Area 1",
                            departmentAreaInseeCode = "A1",
                            isArchived = false,
                            name = "Control Unit 1",
                            termsNote = "Terms 1",
                        ),
                    controlUnitResource =
                        ControlUnitResourceEntity(
                            id = 1,
                            controlUnitId = 1,
                            isArchived = false,
                            name = "Resource 1",
                            note = "Note 1",
                            photo = null,
                            stationId = 1,
                            type = ControlUnitResourceType.BARGE,
                        ),
                    station =
                        StationEntity(
                            id = 1,
                            latitude = 40.7128,
                            longitude = -74.0060,
                            name = "Base 1",
                        ),
                ),
                FullControlUnitResourceDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 2,
                            administrationId = 102,
                            areaNote = "Area 2",
                            departmentAreaInseeCode = "A2",
                            isArchived = false,
                            name = "Control Unit 2",
                            termsNote = "Terms 2",
                        ),
                    controlUnitResource =
                        ControlUnitResourceEntity(
                            id = 2,
                            controlUnitId = 2,
                            isArchived = false,
                            name = "Resource 2",
                            note = "Note 2",
                            photo = null,
                            stationId = 2,
                            type = ControlUnitResourceType.BARGE,
                        ),
                    station =
                        StationEntity(
                            id = 2,
                            latitude = 34.0522,
                            longitude = -118.2437,
                            name = "Base 2",
                        ),
                ),
            )

        given(controlUnitResourceRepository.findAll()).willReturn(controlUnitResources)

        val result = GetControlUnitResources(controlUnitResourceRepository).execute()

        assertThat(result).isEqualTo(controlUnitResources)
        assertThat(result.size).isEqualTo(2)
    }
}
