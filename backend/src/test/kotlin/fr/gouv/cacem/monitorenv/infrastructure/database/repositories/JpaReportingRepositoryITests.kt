package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.config.CustomQueryCountListener
import fr.gouv.cacem.monitorenv.config.DataSourceProxyBeanPostProcessor
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import java.time.Year
import java.time.ZonedDateTime
import java.util.UUID

@Import(DataSourceProxyBeanPostProcessor::class)
class JpaReportingRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var customQueryCountListener: CustomQueryCountListener

    @Autowired
    private lateinit var jpaReportingRepository: JpaReportingRepository

    @BeforeEach
    fun setUp() {
        customQueryCountListener.resetQueryCount() // Reset the count before each test
    }

    @Test
    @Transactional
    fun `archiveReportings should archive multiples reportings`() {
        // Given
        val firstReportingDTO = jpaReportingRepository.findById(2)!!
        assertThat(firstReportingDTO.reporting.isArchived).isEqualTo(false)
        val secondReportingDTO = jpaReportingRepository.findById(3)!!
        assertThat(secondReportingDTO.reporting.isArchived).isEqualTo(false)
        // When
        jpaReportingRepository.archiveReportings(listOf(2, 3))
        // Then
        val firstArchivedReportingDTO = jpaReportingRepository.findById(2)!!
        assertThat(firstArchivedReportingDTO.reporting.isArchived).isEqualTo(true)
        val secondArchivedReportingDTO = jpaReportingRepository.findById(3)!!
        assertThat(secondArchivedReportingDTO.reporting.isArchived).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `archive should archive outdated reporting`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(existingReportingDTO.reporting.isArchived).isEqualTo(false)
        // When
        jpaReportingRepository.archiveOutdatedReportings()
        // Then
        val archivedReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(archivedReportingDTO.reporting.isArchived).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `attach an existing mission to a reporting`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When

        jpaReportingRepository.save(
            existingReportingDTO.reporting.copy(
                missionId = 38,
                attachedToMissionAtUtc = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
            ),
        )

        // Then
        val attachedReportingDTO = jpaReportingRepository.findById(1)!!
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
        val alreadyAttachedReporting = jpaReportingRepository.findById(6)!!
        val reportingToAttach = jpaReportingRepository.findById(7)!!
        assertThat(alreadyAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)
        assertThat(reportingToAttach.reporting.attachedEnvActionId).isNull()

        val attachToReportingIds = listOf(6, 7)
        jpaReportingRepository.attachEnvActionsToReportings(envActionUUID, attachToReportingIds)

        val stillAttachedReporting = jpaReportingRepository.findById(6)!!
        val newlyAttachedReporting = jpaReportingRepository.findById(7)!!

        assertThat(stillAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)
        assertThat(newlyAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)
    }

    @Test
    @Transactional
    fun `attachEnvActionsToReportings should detach action from reporting`() {
        // Given
        val envActionUUID = UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")

        val alreadyAttachedReporting = jpaReportingRepository.findById(6)!!
        assertThat(alreadyAttachedReporting.reporting.attachedEnvActionId).isEqualTo(envActionUUID)

        jpaReportingRepository.attachEnvActionsToReportings(envActionUUID, listOf())

        val stillAttachedReporting = jpaReportingRepository.findById(6)!!

        assertThat(stillAttachedReporting.reporting.attachedEnvActionId).isNull()
    }

    @Test
    @Transactional
    fun `attach an existing envAction to a reporting`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
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
        val attachedReportingDTO = jpaReportingRepository.findById(1)!!
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

        val deletedReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(deletedReportingDTO.reporting.isDeleted).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `detachDanglingEnvActions should set attached_envaction_id to null if envActionIds is not provided`() {
        // Given
        val envActionId = UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")
        val existingReportingDTO = jpaReportingRepository.findById(6)!!
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isEqualTo(envActionId)
        // When
        jpaReportingRepository.detachDanglingEnvActions(missionId = 34, envActionIds = emptyList())
        // Then
        val detachedReportingDTO = jpaReportingRepository.findById(6)!!
        val otherReportingDTO = jpaReportingRepository.findById(7)!!
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
        val existingReportingDTO = jpaReportingRepository.findById(6)!!
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isEqualTo(envActionId)
        // When
        jpaReportingRepository.detachDanglingEnvActions(
            missionId = 34,
            envActionIds = listOf(otherEnvActionId),
        )
        // Then
        val detachedReportingDTO = jpaReportingRepository.findById(6)!!
        val otherReportingDTO = jpaReportingRepository.findById(7)!!
        assertThat(detachedReportingDTO.reporting.missionId).isEqualTo(34)
        assertThat(detachedReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(otherReportingDTO.reporting.missionId).isEqualTo(34)
        assertThat(otherReportingDTO.reporting.attachedEnvActionId).isNull()
    }

    @Test
    @Transactional
    fun `findAll should return all reportings`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = null,
            )
        val queryCount = customQueryCountListener.getQueryCount()
        println("Number of Queries Executed: $queryCount")
        assertThat(reportings.size).isEqualTo(11)
    }

    @Test
    @Transactional
    fun `findAll should return all reporting when targetType filter is set to VEHICLE`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = listOf(TargetTypeEnum.VEHICLE),
                isAttachedToMission = null,
                searchQuery = null,
            )
        assertThat(reportings.size).isEqualTo(4)
        val queryCount = customQueryCountListener.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    fun `findAll should return all reporting when isAttachedToMission filter is set to TRUE`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = true,
                searchQuery = null,
            )
        assertThat(reportings.size).isEqualTo(6)
        val queryCount = customQueryCountListener.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    fun `findAll should return all reportings when searchQuery filter is set to GERANT (vesselName in targetDetails)`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = "gerant",
            )
        assertThat(reportings.size).isEqualTo(2)
        val queryCount = customQueryCountListener.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    fun `findAll should return all reportings when searchQuery filter is set to 9876543210(imo in targetDetails)`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = "9876543210",
            )
        assertThat(reportings.size).isEqualTo(1)
    }

    @Test
    fun `findAll should return all reportings when searchQuery filter is set to COMPANY(operatorName in targetDetails)`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = "company",
            )
        assertThat(reportings.size).isEqualTo(2)
    }

    @Test
    fun `findAll should return all reportings when searchQuery filter is set to 012314231345(mmsi in targetDetails)`() {
        val reportings =
            jpaReportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = "012314231345",
            )
        assertThat(reportings.size).isEqualTo(1)
    }

    @Test
    fun `findByControlUnitId() should find the matching reportings`() {
        val foundReportings = jpaReportingRepository.findByControlUnitId(10000)

        assertThat(foundReportings).hasSize(1)
    }

    @Test
    @Transactional
    fun `findById should return specified reporting`() {
        val reportingDTO = jpaReportingRepository.findById(2)!!
        assertThat(reportingDTO.reporting.id).isEqualTo(2)
        assertThat(reportingDTO.reporting.reportingId).isEqualTo(2300002)
        assertThat(reportingDTO.reporting.reportingSources[0].sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(reportingDTO.reporting.reportingSources[0].semaphoreId).isEqualTo(23)
        assertThat(reportingDTO.reporting.reportingSources[0].controlUnitId).isNull()
        assertThat(reportingDTO.reporting.reportingSources[0].sourceName).isNull()
        assertThat(reportingDTO.reporting.targetType).isEqualTo(TargetTypeEnum.VEHICLE)
        assertThat(reportingDTO.reporting.vehicleType).isEqualTo(VehicleTypeEnum.VESSEL)
        assertThat(reportingDTO.reporting.validityTime).isEqualTo(2)

        val queryCount = customQueryCountListener.getQueryCount()
        println("Number of Queries Executed: $queryCount")
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

        // Given
        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "PN",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2030-12-31T00:00Z"),
                ),
            )
        val theme =
            aTheme(
                id = 2,
                name = "AMP sans réglementation particulière",
                startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                subThemes =
                    listOf(
                        aTheme(
                            id = 160,
                            name = "Contrôle dans une AMP sans réglementation particulière",
                            startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                            endedAt = ZonedDateTime.parse("2023-12-31T00:00Z"),
                        ),
                    ),
            )

        val newReporting =
            ReportingEntity(
                reportingSources =
                    listOf(
                        ReportingSourceEntity(
                            id = null,
                            sourceType = SourceTypeEnum.SEMAPHORE,
                            semaphoreId = 21,
                            controlUnitId = null,
                            sourceName = null,
                            reportingId = null,
                        ),
                    ),
                targetType = TargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                geom = polygon,
                seaFront = "NAMO",
                description = "Test reporting",
                reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                actionTaken = "Aucune",
                isControlRequired = false,
                hasNoUnitAvailable = false,
                createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                validityTime = 24,
                isArchived = false,
                isDeleted = false,
                openBy = "CDA",
                isInfractionProven = true,
                tags = tags,
                theme = theme,
            )

        jpaReportingRepository.save(newReporting)

        val reportingDTO = jpaReportingRepository.findById(12)!!

        // Then
        assertThat(reportingDTO.reporting.id).isEqualTo(12)

        val currentYear = Year.now().value.toString()
        val reportingId = (currentYear.substring(currentYear.length - 2) + "00001").toLong()
        assertThat(reportingDTO.reporting.reportingId).isEqualTo(reportingId)
        assertThat(reportingDTO.reporting.reportingSources[0].sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(reportingDTO.reporting.reportingSources[0].semaphoreId).isEqualTo(21)
        assertThat(reportingDTO.reporting.targetType).isEqualTo(TargetTypeEnum.VEHICLE)
        assertThat(reportingDTO.reporting.vehicleType).isEqualTo(VehicleTypeEnum.VESSEL)
        assertThat(reportingDTO.reporting.geom).isEqualTo(polygon)
        assertThat(reportingDTO.reporting.seaFront).isEqualTo("NAMO")
        assertThat(reportingDTO.reporting.description).isEqualTo("Test reporting")
        assertThat(reportingDTO.reporting.reportType)
            .isEqualTo(ReportingTypeEnum.INFRACTION_SUSPICION)
        assertThat(reportingDTO.reporting.actionTaken).isEqualTo("Aucune")
        assertThat(reportingDTO.reporting.isControlRequired).isEqualTo(false)
        assertThat(reportingDTO.reporting.hasNoUnitAvailable).isEqualTo(false)
        assertThat(reportingDTO.reporting.createdAt)
            .isEqualTo(ZonedDateTime.parse("2023-04-01T00:00:00Z"))
        assertThat(reportingDTO.reporting.validityTime).isEqualTo(24)
        assertThat(reportingDTO.reporting.isArchived).isEqualTo(false)
        assertThat(reportingDTO.reporting.openBy).isEqualTo("CDA")
        assertThat(reportingDTO.reporting.updatedAtUtc).isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(reportingDTO.reporting.theme.id).isEqualTo(theme.id)
        assertThat(reportingDTO.reporting.theme.name).isEqualTo(theme.name)
        assertThat(reportingDTO.reporting.theme.subThemes).hasSize(theme.subThemes.size)
        reportingDTO.reporting.theme.subThemes.find { it.id == theme.subThemes[0].id }.let {
            assertThat(it?.id).isEqualTo(160)
            assertThat(it?.name).isEqualTo("Contrôle dans une AMP sans réglementation particulière")
        }
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
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "PN",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2030-12-31T00:00Z"),
                ),
            )
        val theme =
            aTheme(
                id = 2,
                name = "AMP sans réglementation particulière",
                startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                subThemes =
                    listOf(
                        aTheme(
                            id = 160,
                            name = "Contrôle dans une AMP sans réglementation particulière",
                            startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                            endedAt = ZonedDateTime.parse("2023-12-31T00:00Z"),
                        ),
                    ),
            )
        val updatedReporting =
            existingReportingDTO.reporting.copy(
                reportingSources =
                    listOf(
                        ReportingSourceEntity(
                            id = null,
                            reportingId = null,
                            sourceType = SourceTypeEnum.SEMAPHORE,
                            semaphoreId = 23,
                            controlUnitId = null,
                            sourceName = null,
                        ),
                    ),
                createdAt = ZonedDateTime.parse("2023-04-01T00:00:00Z"),
                isArchived = false,
                openBy = "CDA",
                tags = tags,
                theme = theme,
            )
        val savedReportingDTO = jpaReportingRepository.save(updatedReporting)
        // Then
        assertThat(savedReportingDTO.reporting.id).isEqualTo(1)
        assertThat(savedReportingDTO.reporting.reportingSources[0].sourceType).isEqualTo(SourceTypeEnum.SEMAPHORE)
        assertThat(savedReportingDTO.reporting.reportingSources[0].semaphoreId).isEqualTo(23)
        assertThat(savedReportingDTO.reporting.theme.id).isEqualTo(theme.id)
        assertThat(savedReportingDTO.reporting.theme.name).isEqualTo(theme.name)
        assertThat(savedReportingDTO.reporting.theme.subThemes).hasSize(theme.subThemes.size)
        savedReportingDTO.reporting.theme.subThemes.find { it.id == theme.subThemes[0].id }.let {
            assertThat(it?.id).isEqualTo(160)
            assertThat(it?.name).isEqualTo("Contrôle dans une AMP sans réglementation particulière")
        }

        val numberOfExistingReportingsAfterSave = jpaReportingRepository.count()
        assertThat(numberOfExistingReportingsAfterSave).isEqualTo(11)
    }

    // Test of db constraints, not specific to repository implementations
    @Test
    @Transactional
    fun `an envAction cannot be attached to a reporting without a mission`() {
        // Given
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When

        val exception =
            assertThrows<BackendUsageException> {
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
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(existingReportingDTO.reporting.attachedEnvActionId).isNull()
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When

        val exception =
            assertThrows<BackendUsageException> {
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
        val existingReportingDTO = jpaReportingRepository.findById(1)!!
        assertThat(existingReportingDTO.reporting.missionId).isNull()
        // When
        val exception =
            assertThrows<BackendUsageException> {
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
        val existingReportingDTO = jpaReportingRepository.findById(6)!!
        assertThat(existingReportingDTO.reporting.detachedFromMissionAtUtc).isNull()
        // When
        val exception =
            assertThrows<BackendUsageException> {
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
        val reportingNotAttachedYet = jpaReportingRepository.findById(1)!!
        val alreadyAttachedReporting = jpaReportingRepository.findById(6)!!
        val secondAlreadyAttachedReporting = jpaReportingRepository.findById(7)!!
        val attachedReportingToOtherMission = jpaReportingRepository.findById(8)!!

        assertThat(reportingNotAttachedYet.reporting.missionId).isNull()
        assertThat(alreadyAttachedReporting.reporting.missionId).isEqualTo(34)
        assertThat(secondAlreadyAttachedReporting.reporting.missionId).isEqualTo(34)
        assertThat(attachedReportingToOtherMission.reporting.missionId).isEqualTo(38)
        jpaReportingRepository.attachReportingsToMission(
            reportingIds = listOf(1, 6),
            missionId = 34,
        )

        val reportingAttachedToMission = jpaReportingRepository.findById(1)!!
        val alreadyAttachedReportingAttachedToMission = jpaReportingRepository.findById(6)!!
        val secondAlreadyAttachedReportingDetachedFromMission = jpaReportingRepository.findById(7)!!
        val attachedReportingToOtherMissionNotAttachedToMission = jpaReportingRepository.findById(8)!!

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
        ).isNotNull()
        assertThat(
            secondAlreadyAttachedReportingDetachedFromMission
                .reporting
                .detachedFromMissionAtUtc,
        ).isNotNull()

        assertThat(attachedReportingToOtherMissionNotAttachedToMission.reporting.missionId)
            .isEqualTo(38)
        assertThat(
            attachedReportingToOtherMissionNotAttachedToMission
                .reporting
                .attachedToMissionAtUtc,
        ).isNotNull()
        assertThat(
            attachedReportingToOtherMissionNotAttachedToMission
                .reporting
                .detachedFromMissionAtUtc,
        ).isNull()
    }

    @Test
    fun `findAllById should return all reportings that match ids `() {
        // Given
        val ids = listOf(1, 2, 3)

        // When
        val reportings = jpaReportingRepository.findAllById(ids)

        // Then
        assertThat(reportings).hasSize(3)
        assertThat(reportings[0].reporting.id).isEqualTo(1)
        assertThat(reportings[1].reporting.id).isEqualTo(2)
        assertThat(reportings[2].reporting.id).isEqualTo(3)
    }

    @Test
    fun `findAllByGeometry should return all reportings that intersect the geometry `() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-5.29467558 48.36564013, -5.17259684 48.36564013, -5.17259684 48.4353756, -5.29467558 48.4353756, -5.29467558 48.36564013)),((-3.57357208 48.97647554, -3.34729792 49.03663561, -3.31147549 48.82323819, -3.46975201 48.81968417, -3.57357208 48.97647554)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val reportings = jpaReportingRepository.findAllIdsByGeometry(polygon)

        // Then
        assertThat(reportings).hasSize(1)
        assertThat(reportings[0]).isEqualTo(3)
    }

    @Test
    fun `findAllByGeometry should return an empty list when nothing intersect the geometry `() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-5.29467558 48.36564013, -5.17259684 48.36564013, -5.17259684 48.4353756, -5.29467558 48.4353756, -5.29467558 48.36564013),( -3.53420346 48.95745721, -3.39475348 49.03980926, -3.35510462 48.90660067, -3.43958402 48.88563259, -3.53420346 48.95745721)))"

        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val reportings = jpaReportingRepository.findAllIdsByGeometry(polygon)

        // Then
        assertThat(reportings).isEmpty()
    }

    @Test
    fun `findAllSuspicionOfOffenseByMmsi should return a SuspicionOfOffense `() {
        // Given
        val mmsi = "012314231345"

        // When
        val suspicionOfOffense = jpaReportingRepository.findNbOfSuspicionOfOffense(mmsi)

        // Then
        assertThat(suspicionOfOffense.amount).isEqualTo(1)
        assertThat(suspicionOfOffense.themes).hasSize(1)
    }

    @Test
    fun `findAllSuspicionOfOffenseByMmsi should return SuspicionOfOffense when there is no reporting for given mmsi `() {
        // Given
        val mmsi = "unknown mmsi"

        // When
        val suspicionOfOffense = jpaReportingRepository.findNbOfSuspicionOfOffense(mmsi)

        // Then
        assertThat(suspicionOfOffense.amount).isZero()
        assertThat(suspicionOfOffense.themes).isNull()
    }
}
