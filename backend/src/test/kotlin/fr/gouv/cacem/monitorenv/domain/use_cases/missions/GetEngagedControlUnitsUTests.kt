package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.anyOrNull
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class GetEngagedControlUnitsUTests {
    @MockBean private lateinit var getFullMissions: GetFullMissions

    @Test
    fun `execute() should return engaged control units`() {
        val firstControlUnit =
            LegacyControlUnitEntity(
                id = 123,
                administration = "Admin",
                resources = listOf(),
                isArchived = false,
                name = "Control Unit Name",
            )
        val secondControlUnit =
            LegacyControlUnitEntity(
                id = 123,
                administration = "Admin",
                resources = listOf(),
                isArchived = false,
                name = "Control Unit Name",
            )
        val firstMission =
            MissionDTO(
                mission =
                MissionEntity(
                    id = 10,
                    controlUnits = listOf(firstControlUnit),
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    observationsCacem = null,
                    startDateTimeUtc =
                    ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc =
                    ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                ),
            )
        val secondMission =
            MissionDTO(
                mission =
                MissionEntity(
                    id = 10,
                    controlUnits = listOf(secondControlUnit),
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    observationsCacem = null,
                    startDateTimeUtc =
                    ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc =
                    ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORFISH,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                ),
            )

        given(
            getFullMissions.execute(
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
                anyOrNull(),
            ),
        )
            .willReturn(
                listOf(
                    firstMission,
                    secondMission,
                ),
            )

        val controlUnits = GetEngagedControlUnits(getFullMissions).execute()

        assertThat(controlUnits).hasSize(1)
        assertThat(controlUnits.first().first.name).isEqualTo("Control Unit Name")
        assertThat(controlUnits.first().second.first()).isEqualTo(MissionSourceEnum.MONITORENV)
        assertThat(controlUnits.first().second.last()).isEqualTo(MissionSourceEnum.MONITORFISH)
    }
}
