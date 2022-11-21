 
package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.UpdateMission
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.catchThrowable
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class UpdateMissionUTests {

    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var facadeAreasRepository: IFacadeAreasRepository

    @Test
    fun `execute Should throw an exception When no mission to update is given`() {
        // When
        val throwable = catchThrowable {
            UpdateMission(missionRepository, facadeAreasRepository)
                .execute(null)
        }

        // Then
        assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwable.message).contains("No mission to update")
    }

    @Test
    fun `execute Should return the updated mission When a field to update is given`() {
        // Given
        val expectedUpdatedMission = MissionEntity(
            id = 0,
            missionType = MissionTypeEnum.LAND,
            missionStatus = MissionStatusEnum.CLOSED,
            facade = "Outre-Mer",
            missionNature = listOf(MissionNatureEnum.FISH),
            inputStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            inputEndDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isDeleted = false,
            missionSource = MissionSourceEnum.CACEM
        )
        given(missionRepository.save(expectedUpdatedMission)).willReturn(
            expectedUpdatedMission
        )

        // When
        val updatedMission = UpdateMission(missionRepository, facadeAreasRepository)
            .execute(expectedUpdatedMission)

        // Then
        verify(missionRepository, times(1)).save(expectedUpdatedMission)
        assertThat(updatedMission).isEqualTo(expectedUpdatedMission)
    }
}
