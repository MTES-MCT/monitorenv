package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import java.time.ZonedDateTime
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import com.nhaarman.mockitokotlin2.anyOrNull

@ExtendWith(SpringExtension::class)
class GetMissionsUTests {
    @MockBean
    private lateinit var missionRepository: IMissionRepository

    private val controlUnit1: LegacyControlUnitEntity = LegacyControlUnitEntity(
        id =  1,
        administration =  "whatever",
        isArchived =  false,
        name =  "whatever",
        resources =  listOf(),
    )

    private val controlUnit2: LegacyControlUnitEntity = LegacyControlUnitEntity(
        id =  2,
        administration =  "whatever",
        isArchived =  false,
        name =  "whatever",
        resources =  listOf(),
    )

    private val controlUnit3: LegacyControlUnitEntity = LegacyControlUnitEntity(
        id =  3,
        administration =  "whatever",
        isArchived =  false,
        name =  "whatever",
        resources =  listOf(),
    )

    private val mission1 =
        MissionEntity(
            id = 10,
            missionTypes = listOf(MissionTypeEnum.SEA),
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORFISH,
            isClosed = false,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false,
            controlUnits = listOf(controlUnit1, controlUnit2)
        )

    private val mission2 =
        MissionEntity(
            id = 11,
            missionTypes = listOf(MissionTypeEnum.SEA),
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORFISH,
            isClosed = false,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false,
            controlUnits = listOf(controlUnit1, controlUnit3)
        )

    @Test
    fun `execute should return all missions when filter for controlUnits is null`() {
        given(missionRepository.findAll(
            startedAfter = anyOrNull(),
            startedBefore = anyOrNull(),
            missionSources = anyOrNull(),
            missionTypes = anyOrNull(),
            missionStatuses = anyOrNull(),
            seaFronts = anyOrNull(),
            pageable = anyOrNull(),
        )).willReturn(listOf(mission1, mission2))

        val result = GetMissions(missionRepository).execute(
            controlUnits = null
        )

        assertThat(result.size).isEqualTo(2)
    }

    @Test
    fun `execute should return all missions when filter for controlUnits is an empty list`() {
        given(missionRepository.findAll(
            startedAfter = anyOrNull(),
            startedBefore = anyOrNull(),
            missionSources = anyOrNull(),
            missionTypes = anyOrNull(),
            missionStatuses = anyOrNull(),
            seaFronts = anyOrNull(),
            pageable = anyOrNull(),
        )).willReturn(listOf(mission1, mission2))

        val result = GetMissions(missionRepository).execute(
            controlUnits = listOf()
        )

        assertThat(result.size).isEqualTo(2)
    }

    @Test
    fun `execute should only one missions when the controlUnits input matches 1 mission`() {
        given(missionRepository.findAll(
            startedAfter = anyOrNull(),
            startedBefore = anyOrNull(),
            missionSources = anyOrNull(),
            missionTypes = anyOrNull(),
            missionStatuses = anyOrNull(),
            seaFronts = anyOrNull(),
            pageable = anyOrNull(),
        )).willReturn(listOf(mission1, mission2))

        val result = GetMissions(missionRepository).execute(
            controlUnits = listOf(controlUnit2.id)
        )

        assertThat(result.size).isEqualTo(1)
        assertThat(result.first()).isEqualTo(mission1)
    }

    @Test
    fun `execute should only two missions when the same controlUnits input matches 2 missions`() {
        given(missionRepository.findAll(
            startedAfter = anyOrNull(),
            startedBefore = anyOrNull(),
            missionSources = anyOrNull(),
            missionTypes = anyOrNull(),
            missionStatuses = anyOrNull(),
            seaFronts = anyOrNull(),
            pageable = anyOrNull(),
        )).willReturn(listOf(mission1, mission2))

        val result = GetMissions(missionRepository).execute(
            controlUnits = listOf(controlUnit1.id)
        )

        assertThat(result.size).isEqualTo(2)
    }

    @Test
    fun `execute should return filtered missions matching multiple controlUnits input`() {
        given(missionRepository.findAll(
            startedAfter = anyOrNull(),
            startedBefore = anyOrNull(),
            missionSources = anyOrNull(),
            missionTypes = anyOrNull(),
            missionStatuses = anyOrNull(),
            seaFronts = anyOrNull(),
            pageable = anyOrNull(),
        )).willReturn(listOf(mission1, mission2))

        val result = GetMissions(missionRepository).execute(
            controlUnits = listOf(controlUnit2.id, controlUnit3.id)
        )

        assertThat(result.size).isEqualTo(2)
    }

}
