package fr.gouv.cacem.monitorenv.domain.mappers

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime
import java.util.*

class PatchMissionEntityUTest {

    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity> = PatchEntity()

    @Test
    fun `execute() should return mission with observationsByUnit modified if its present`() {
        // Given
        val observationsByUnit = "observationsByUnit"
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity = PatchableMissionEntity(
            observationsByUnit = Optional.of(observationsByUnit),
            startDateTimeUtc = null,
            endDateTimeUtc = null
        )

        // When
        val mergedMissionEntity = patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(mergedMissionEntity.observationsByUnit).isEqualTo(observationsByUnit)
    }

    @Test
    fun `execute() should return mission with observationsByUnit null if its empty`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity = PatchableMissionEntity(
            observationsByUnit = Optional.empty(),
            startDateTimeUtc = null,
            endDateTimeUtc = null
        )

        // When
        val mergedMissionEntity = patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(mergedMissionEntity.observationsByUnit).isNull()
    }

    @Test
    fun `execute() should return envAction with old values if its null`() {
        // Given
        val observationsByUnit = "old value"
        val missionEntity = MissionFixture.aMissionEntity(observationsByUnit = observationsByUnit)
        val patchableMissionEntity = PatchableMissionEntity(
            observationsByUnit = null,
            startDateTimeUtc = null,
            endDateTimeUtc = Optional.empty(),
        )

        // When
        val mergedMissionEntity = patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(mergedMissionEntity.observationsByUnit).isEqualTo(observationsByUnit)
    }


    @Test
    fun `execute() should return mission with start+endDateTimes modified if its present`() {
        // Given
        val startDateTimeUtc = ZonedDateTime.parse("2024-04-11T07:00:00Z")
        val endDateTimeUtc = ZonedDateTime.parse("2024-04-22T07:00:00Z")
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity = PatchableMissionEntity(
            observationsByUnit = Optional.empty(),
            startDateTimeUtc = Optional.of(startDateTimeUtc),
            endDateTimeUtc = Optional.of(endDateTimeUtc)
        )

        // When
        val mergedMissionEntity = patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(mergedMissionEntity.startDateTimeUtc).isEqualTo(startDateTimeUtc)
        assertThat(mergedMissionEntity.endDateTimeUtc).isEqualTo(endDateTimeUtc)
    }

    @Test
    fun `execute() should return mission with endDateTimes null if its empty`() {
        // Given
        val missionEntity = MissionFixture.aMissionEntity()
        val patchableMissionEntity = PatchableMissionEntity(
            observationsByUnit = Optional.empty(),
            startDateTimeUtc = null,
            endDateTimeUtc = Optional.empty()
        )

        // When
        val mergedMissionEntity = patchEntity.execute(missionEntity, patchableMissionEntity)

        // Then
        assertThat(mergedMissionEntity.endDateTimeUtc).isNull()
    }
}
