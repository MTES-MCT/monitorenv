package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.anyOrNull
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class GetEngagedControlUnitsUTests {
    @MockBean
    private lateinit var getMissions: GetMissions

    @Test
    fun `execute() should return engaged control units`() {
        val expectedControlUnit = LegacyControlUnitEntity(
            id = 123,
            administration = "Admin",
            resources = listOf(),
            isArchived = false,
            name = "Control Unit Name"
        )
        val expectedMission = MissionEntity(
            id = 10,
            controlUnits = listOf(expectedControlUnit),
            missionTypes = listOf(MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            geom = null,
            observationsCacem = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isDeleted = false,
            isClosed = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false,
        )

        given(getMissions.execute(anyOrNull(), anyOrNull(), anyOrNull(), anyOrNull(), anyOrNull(), anyOrNull(), anyOrNull(), anyOrNull()))
            .willReturn(listOf(expectedMission, expectedMission))

        val controlUnits = GetEngagedControlUnits(getMissions).execute()

        assertThat(controlUnits).hasSize(1)
        assertThat(controlUnits.first().name).isEqualTo("Control Unit Name")
    }
}
