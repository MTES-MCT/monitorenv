package fr.gouv.cacem.monitorenv.domain.mappers

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime
import java.util.Optional

class PatchMissionEntityUTest {
    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity> = PatchEntity()

    @Test
    fun `execute() should return mission with observationsByUnit modified if its present`() {
        // Given
        val observationsByUnit = "observationsByUnit"
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = null,
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = Optional.of(observationsByUnit),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.observationsByUnit).isEqualTo(observationsByUnit)
    }

    @Test
    fun `execute() should return mission with observationsByUnit null if its empty`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = null,
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.observationsByUnit).isNull()
    }

    @Test
    fun `execute() should return envAction with old values if its null`() {
        // Given
        val observationsByUnit = "old value"
        val missionEntity = MissionFixture.aMissionEntity(observationsByUnit = observationsByUnit)
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = Optional.empty(),
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = null,
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.observationsByUnit).isEqualTo(observationsByUnit)
    }

    @Test
    fun `execute() should return mission with start+endDateTimes modified if its present`() {
        // Given
        val startDateTimeUtc = ZonedDateTime.parse("2024-04-11T07:00:00Z")
        val endDateTimeUtc = ZonedDateTime.parse("2024-04-22T07:00:00Z")
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = Optional.of(endDateTimeUtc),
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = startDateTimeUtc,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.startDateTimeUtc).isEqualTo(startDateTimeUtc)
        assertThat(missionEntity.endDateTimeUtc).isEqualTo(endDateTimeUtc)
    }

    @Test
    fun `execute() should return the original datetime if given as null`() {
        // Given
        val startDateTimeUtc = ZonedDateTime.parse("2024-04-11T07:00:00Z")
        val endDateTimeUtc = ZonedDateTime.parse("2024-04-22T07:00:00Z")
        val missionEntity =
            MissionFixture.aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
            )
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = null,
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.startDateTimeUtc).isEqualTo(startDateTimeUtc)
        assertThat(missionEntity.endDateTimeUtc).isEqualTo(endDateTimeUtc)
    }

    @Test
    fun `execute() should return mission with endDateTimes null if its empty`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = Optional.empty(),
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.endDateTimeUtc).isNull()
    }

    @Test
    fun `execute() should return mission with with isUnderJdp turned false`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity(isUnderJdp = true)
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = Optional.empty(),
                isUnderJdp = false,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.isUnderJdp).isEqualTo(false)
    }

    @Test
    fun `execute() should return the original isUnderJdp if given as null`() {
        // Given
        val isUnderJdp = true
        val missionEntity =
            MissionFixture.aMissionEntity(
                isUnderJdp = isUnderJdp,
            )
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = null,
                isUnderJdp = null,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.isUnderJdp).isEqualTo(isUnderJdp)
    }

    @Test
    fun `execute() should return mission with missionTypes modified if its present`() {
        // Given
        val missionTypes = listOf(MissionTypeEnum.AIR, MissionTypeEnum.SEA)
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = null,
                isUnderJdp = null,
                missionTypes = missionTypes,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.missionTypes).isEqualTo(missionTypes)
    }

    @Test
    fun `execute() should return the original missionTypes if given as null`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = Optional.empty(),
                isUnderJdp = null,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.missionTypes).isEqualTo(listOf(MissionTypeEnum.LAND))
    }

    @Test
    fun `execute() should return mission with controlUnits modified if its present`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val controlUnit =
            listOf(
                ControlUnitEntity(
                    id = 2,
                    administrationId = null,
                    administration = null,
                    isArchived = false,
                    name = "BN Toulon",
                ),
            )
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = controlUnit,
                controlResources = null,
                endDateTimeUtc = null,
                isUnderJdp = null,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.controlUnits).isEqualTo(controlUnit)
    }

    @Test
    fun `execute() should return the original controlUnit if given as null`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                endDateTimeUtc = Optional.empty(),
                isUnderJdp = null,
                missionTypes = null,
                observationsByUnit = Optional.empty(),
                startDateTimeUtc = null,
            )

        // When
        patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(missionEntity.controlUnits).isEqualTo(listOf(aControlUnit()))
    }
}
