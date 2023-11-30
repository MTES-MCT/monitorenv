package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Pageable
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.*

@SpringBootTest(properties = ["monitorenv.scheduling.enabled=false"])
class JpaReportingRepositoryITests : AbstractDBTests() {
    @Autowired private lateinit var jpaReportingRepository: JpaReportingRepository

    @Test
    @Transactional
    fun `archiveReportings should archive multiples reportings`() {
        // Given
        val firstReportingDTO = jpaReportingRepository.findById(2)
        assertThat(firstReportingDTO.reporting.isArchived).isEqualTo(false)
        val secondReportingDTO = jpaReportingRepository.findById(3)
        assertThat(secondReportingDTO.reporting.isArchived).isEqualTo(false)
        // When
        jpaReportingRepository.archiveReportings(listOf(2, 3))
        // Then
        val firstArchivedReportingDTO = jpaReportingRepository.findById(2)
        assertThat(firstArchivedReportingDTO.reporting.isArchived).isEqualTo(true)
        val secondArchivedReportingDTO = jpaReportingRepository.findById(3)
        assertThat(secondArchivedReportingDTO.reporting.isArchived).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `archive should archive outdated reporting`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)
        assertThat(existingReportingDTO.reporting.isArchived).isEqualTo(false)
        // When
        jpaReportingRepository.archiveOutdatedReportings()
        // Then
        val archivedReportingDTO = jpaReportingRepository.findById(1)
        assertThat(archivedReportingDTO.reporting.isArchived).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `attach an existing mission to a reporting`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When

        jpaReportingRepository.save(
            existingReportingDTO.reporting.copy(
                missionId = 38,
                attachedToMissionAtUtc = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
            ),
        )

        // Then
        val attachedReportingDTO = jpaReportingRepository.findById(1)
        assertThat(attachedReportingDTO.reporting.missionId).isEqualTo(38)
        assertThat(attachedReportingDTO.reporting.attachedToMissionAtUtc)
            .isEqualTo(
                ZonedDateTime.parse("2023-04-01T00:00:00Z"),
            )
    }

    @Test
    @Transactional
    fun `attachEnvActionsToReportings should attach action to a second reporting`() {
        // Given
        val envActionUUID = UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")
        val alreadyAttachedReporting = jpaReportingRepository.findById(6)
        val reportingToAttach = jpaReportingRepository.findById(7)
        assertThat(alreadyAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)
        assertThat(reportingToAttach.reporting.attachedEnvActionId).isNull()

        val attachToReportingIds = listOf(6, 7)
        jpaReportingRepository.attachEnvActionsToReportings(envActionUUID, attachToReportingIds)

        val stillAttachedReporting = jpaReportingRepository.findById(6)
        val newlyAttachedReporting = jpaReportingRepository.findById(7)

        assertThat(stillAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)
        assertThat(newlyAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)
    }

    @Test
    @Transactional
    fun `attachEnvActionsToReportings should detach action from reporting`() {
        // Given
        val envActionUUID = UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")

        val alreadyAttachedReporting = jpaReportingRepository.findById(6)
        assertThat(alreadyAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)

        jpaReportingRepository.attachEnvActionsToReportings(envActionUUID, listOf())

        val stillAttachedReporting = jpaReportingRepository.findById(6)

        assertThat(stillAttachedReporting.reporting.attachedEnvActionId).isNull()
    }

    @Test
    @Transactional
    fun `attach an existing envAction to a reporting`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)
        val reportingWithMissionDTO =
            jpaReportingRepository.save(
                existingReportingDTO.reporting.copy(
                    missionId = 38,
                    attachedToMissionAtUtc =
                    ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                ),
            )
        assertThat(reportingWithMissionDTO.reporting.attachedEnvActionId).isNull()
        assertThat(reportingWithMissionDTO.reporting.missionId).isEqualTo(38)
        // When

        jpaReportingRepository.save(
            reportingWithMissionDTO.reporting.copy(
                attachedEnvActionId =
                UUID.fromString("e2257638-ddef-4611-960c-7675a3254c38"),
            ),
        )

        // Then
        val attachedReportingDTO = jpaReportingRepository.findById(1)
        assertThat(attachedReportingDTO.reporting.attachedEnvActionId)
            .isEqualTo(
                UUID.fromString("e2257638-ddef-4611-960c-7675a3254c38"),
            )
    }

    @Test
    @Transactional
    fun `delete should soft delete reporting`() {
        // Given
        val numberOfExistingReportings = jpaReportingRepository.count()
        assertThat(numberOfExistingReportings).isEqualTo(11)

        // When
        jpaReportingRepository.delete(1)

        // Then
        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(11)

        val deletedReportingDTO = jpaReportingRepository.findById(1)
        assertThat(deletedReportingDTO.reporting.isDeleted).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `detachDanglingEnvActions should set attached_envaction_id to null if envActionIds is not provided`() {
        // Given
        val envActionId = UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")
        val existingReportingDTO = jpaReportingRepository.findById(6)
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isEqualTo(envActionId)
        // When
        jpaReportingRepository.detachDanglingEnvActions(missionId = 34, envActionIds = emptyList())
        // Then
        val detachedReportingDTO = jpaReportingRepository.findById(6)
        val otherReportingDTO = jpaReportingRepository.findById(7)
        assertThat(detachedReportingDTO.reporting.missionId).isEqualTo(34)
        assertThat(detachedReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(otherReportingDTO.reporting.missionId).isEqualTo(34)
        assertThat(otherReportingDTO.reporting.attachedEnvActionId).isNull()
    }

    @Test
    @Transactional
    fun `detachDanglingEnvActions should set attached_envaction_id to null if envActionId is not in provided list`() {
        // Given
        val envActionId = UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")
        val otherEnvActionId = UUID.fromString("475d2887-5344-46cd-903b-8cb5e42f9a9c")
        val existingReportingDTO = jpaReportingRepository.findById(6)
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isEqualTo(envActionId)
        // When
        jpaReportingRepository.detachDanglingEnvActions(
            missionId = 34,
            envActionIds = listOf(otherEnvActionId),
        )
        // Then
        val detachedReportingDTO = jpaReportingRepository.findById(6)
        val otherReportingDTO = jpaReportingRepository.findById(7)
        assertThat(detachedReportingDTO.reporting.missionId).isEqualTo(34)
        assertThat(detachedReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(otherReportingDTO.reporting.missionId).isEqualTo(34)
        assertThat(otherReportingDTO.reporting.attachedEnvActionId).isNull()
    }

    @Test
    fun `findAll should return all reportings`() {
        val reportings =
            jpaReportingRepository.findAll(
                Pageable.unpaged(),
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
            )
        assertThat(reportings.size).isEqualTo(11)
    }

    @Test
    fun `findByControlUnitId() should find the matching reportings`() {
        val foundReportings = jpaReportingRepository.findByControlUnitId(10000)

        assertThat(foundReportings).hasSize(1)
    }

    @Test
    fun `findById should return specified reporting`() {
        val reportingDTO = jpaReportingRepository.findById(1)
        assertThat(reportingDTO.reporting.id).isEqualTo(1)
        assertThat(reportingDTO.reporting.reportingId).isEqualTo(2300001)
        assertThat(reportingDTO.reporting.sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(reportingDTO.reporting.semaphoreId).isEqualTo(21)
        assertThat(reportingDTO.reporting.controlUnitId).isNull()
        assertThat(reportingDTO.reporting.sourceName).isNull()
        assertThat(reportingDTO.reporting.targetType).isEqualTo(TargetTypeEnum.VEHICLE)
        assertThat(reportingDTO.reporting.vehicleType).isEqualTo(VehicleTypeEnum.VESSEL)
        assertThat(reportingDTO.reporting.validityTime).isEqualTo(24)
    }

    @Test
    @Transactional
    fun `save should create a new Reporting`() {
        // Given
        val numberOfExistingReportings = jpaReportingRepository.count()
        assertThat(numberOfExistingReportings).isEqualTo(11)

        // When
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val newReporting =
            ReportingEntity(
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 21,
                targetType = TargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                geom = polygon,
                seaFront = "NAMO",
                description = "Test reporting",
                reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                theme = "Police des mouillages",
                subThemes = listOf("ZMEL"),
                actionTaken = "Aucune",
                isControlRequired = false,
                hasNoUnitAvailable = false,
                createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                validityTime = 24,
                isArchived = false,
                isDeleted = false,
                openBy = "CDA",
            )

        jpaReportingRepository.save(newReporting)

        val reportingDTO = jpaReportingRepository.findById(12)

        // Then
        assertThat(reportingDTO.reporting.id).isEqualTo(12)
        assertThat(reportingDTO.reporting.reportingId).isEqualTo(2300012)
        assertThat(reportingDTO.reporting.sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(reportingDTO.reporting.semaphoreId).isEqualTo(21)
        assertThat(reportingDTO.reporting.targetType).isEqualTo(TargetTypeEnum.VEHICLE)
        assertThat(reportingDTO.reporting.vehicleType).isEqualTo(VehicleTypeEnum.VESSEL)
        assertThat(reportingDTO.reporting.geom).isEqualTo(polygon)
        assertThat(reportingDTO.reporting.seaFront).isEqualTo("NAMO")
        assertThat(reportingDTO.reporting.description).isEqualTo("Test reporting")
        assertThat(reportingDTO.reporting.reportType)
            .isEqualTo(ReportingTypeEnum.INFRACTION_SUSPICION)
        assertThat(reportingDTO.reporting.theme).isEqualTo("Police des mouillages")
        assertThat(reportingDTO.reporting.subThemes).isEqualTo(listOf("ZMEL"))
        assertThat(reportingDTO.reporting.actionTaken).isEqualTo("Aucune")
        assertThat(reportingDTO.reporting.isControlRequired).isEqualTo(false)
        assertThat(reportingDTO.reporting.hasNoUnitAvailable).isEqualTo(false)
        assertThat(reportingDTO.reporting.createdAt)
            .isEqualTo(ZonedDateTime.parse("2023-04-01T00:00:00Z"))
        assertThat(reportingDTO.reporting.validityTime).isEqualTo(24)
        assertThat(reportingDTO.reporting.isArchived).isEqualTo(false)
        assertThat(reportingDTO.reporting.openBy).isEqualTo("CDA")

        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(12)
    }

    @Test
    @Transactional
    fun `save should update an existing Reporting`() {
        // Given
        val numberOfExistingReportings = jpaReportingRepository.count()
        assertThat(numberOfExistingReportings).isEqualTo(11)

        // When
        val existingReportingDTO = jpaReportingRepository.findById(1)
        val updatedReporting =
            existingReportingDTO.reporting.copy(
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 23,
                createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                isArchived = false,
                openBy = "CDA",
            )
        val savedReportingDTO = jpaReportingRepository.save(updatedReporting)
        // Then
        assertThat(savedReportingDTO.reporting.id).isEqualTo(1)
        assertThat(savedReportingDTO.reporting.sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(savedReportingDTO.reporting.semaphoreId).isEqualTo(23)

        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(11)
    }

    // Test of db constraints, not specific to repository implementations
    @Test
    @Transactional
    fun `an envAction cannot be attached to a reporting without a mission`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When

        val exception =
            assertThrows<NotFoundException> {
                jpaReportingRepository.save(
                    existingReportingDTO.reporting.copy(
                        attachedEnvActionId =
                        UUID.fromString("e2257638-ddef-4611-960c-7675a3254c38"),
                    ),
                )
            }

        // Then
        assertThat(exception.message)
            .isEqualTo(
                "Invalid combination of mission and/or envAction",
            )
    }

    @Test
    @Transactional
    fun `an envAction cannot be attached to a reporting from another mission`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When

        val exception =
            assertThrows<NotFoundException> {
                jpaReportingRepository.save(
                    existingReportingDTO.reporting.copy(
                        missionId = 42,
                        attachedEnvActionId =
                        UUID.fromString("e2257638-ddef-4611-960c-7675a3254c38"),
                    ),
                )
            }

        // Then
        assertThat(exception.message)
            .isEqualTo(
                "Invalid combination of mission and/or envAction",
            )
    }

    @Test
    @Transactional
    fun `a reporting cannot be attached to a non existing mission`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When
        val exception =
            assertThrows<NotFoundException> {
                jpaReportingRepository.save(
                    existingReportingDTO.reporting.copy(
                        missionId = 100,
                        attachedToMissionAtUtc =
                        ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                    ),
                )
            }
        // Then
        assertThat(exception.message)
            .isEqualTo(
                "Invalid reference to semaphore, control unit or mission: not found in referential",
            )
    }

    @Test
    @Transactional
    fun `a mission cannot be detached from a reporting if an envAction is still attached`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(6)
        assertThat(existingReportingDTO.reporting.detachedFromMissionAtUtc).isNull()
        // When
        val exception =
            assertThrows<NotFoundException> {
                jpaReportingRepository.save(
                    existingReportingDTO.reporting.copy(
                        detachedFromMissionAtUtc =
                        ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                    ),
                )
            }
        // Then
        assertThat(exception.message)
            .isEqualTo(
                "Invalid combination of mission and/or envAction",
            )
    }

    @Test
    @Transactional
    fun `a mission can be attached to one or several reportings`() {
        val reportingNotAttachedYet = jpaReportingRepository.findById(1)
        val alreadyAttachedReporting = jpaReportingRepository.findById(6)
        val secondAlreadyAttachedReporting = jpaReportingRepository.findById(7)
        val attachedReportingToOtherMission = jpaReportingRepository.findById(8)

        assertThat(reportingNotAttachedYet.reporting.missionId).isNull()
        assertThat(alreadyAttachedReporting.reporting.missionId).isEqualTo(34)
        assertThat(secondAlreadyAttachedReporting.reporting.missionId).isEqualTo(34)
        assertThat(attachedReportingToOtherMission.reporting.missionId).isEqualTo(38)
        jpaReportingRepository.attachReportingsToMission(
            reportingIds = listOf(1, 6),
            missionId = 34,
        )

        val reportingAttachedToMission = jpaReportingRepository.findById(1)
        val alreadyAttachedReportingAttachedToMission = jpaReportingRepository.findById(6)
        val secondAlreadyAttachedReportingDetachedFromMission = jpaReportingRepository.findById(7)
        val attachedReportingToOtherMissionNotAttachedToMission = jpaReportingRepository.findById(8)

        assertThat(reportingAttachedToMission.reporting.missionId).isEqualTo(34)
        assertThat(reportingAttachedToMission.reporting.attachedToMissionAtUtc).isNotNull()
        assertThat(reportingAttachedToMission.reporting.detachedFromMissionAtUtc).isNull()

        assertThat(alreadyAttachedReportingAttachedToMission.reporting.missionId).isEqualTo(34)
        assertThat(alreadyAttachedReportingAttachedToMission.reporting.attachedToMissionAtUtc)
            .isNotNull()
        assertThat(alreadyAttachedReportingAttachedToMission.reporting.detachedFromMissionAtUtc)
            .isNull()

        assertThat(secondAlreadyAttachedReportingDetachedFromMission.reporting.missionId)
            .isEqualTo(34)
        assertThat(
            secondAlreadyAttachedReportingDetachedFromMission
                .reporting
                .attachedToMissionAtUtc,
        )
            .isNotNull()
        assertThat(
            secondAlreadyAttachedReportingDetachedFromMission
                .reporting
                .detachedFromMissionAtUtc,
        )
            .isNotNull()

        assertThat(attachedReportingToOtherMissionNotAttachedToMission.reporting.missionId)
            .isEqualTo(38)
        assertThat(
            attachedReportingToOtherMissionNotAttachedToMission
                .reporting
                .attachedToMissionAtUtc,
        )
            .isNotNull()
        assertThat(
            attachedReportingToOtherMissionNotAttachedToMission
                .reporting
                .detachedFromMissionAtUtc,
        )
            .isNull()
    }
}
