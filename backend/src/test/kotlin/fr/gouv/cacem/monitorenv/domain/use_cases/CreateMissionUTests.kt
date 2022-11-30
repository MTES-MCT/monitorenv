package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateMission
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class CreateMissionUTests {

    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var facadeAreasRepository: IFacadeAreasRepository

    @Test
    fun `should create and return a new mission`() {
        // Given
        val expectedCreatedMission = MissionEntity(
            missionType = MissionTypeEnum.LAND,
            missionNature = listOf(MissionNatureEnum.ENV),
            facade = "Outre-Mer",
            inputStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            inputEndDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.CACEM
        )
        given(missionRepository.create(expectedCreatedMission)).willReturn(expectedCreatedMission)

        // When
        val createdMission = CreateMission(missionRepository, facadeAreasRepository).execute(expectedCreatedMission)

        // Then
        verify(missionRepository, times(1)).create(expectedCreatedMission)
        assertThat(createdMission).isEqualTo(expectedCreatedMission)
    }
}
