package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.ReportingAlreadyAttachedException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingSourceSemaphore
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.ApplicationEventPublisher
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class CreateOrUpdateReportingUTests {
    @MockBean
    private lateinit var reportingRepository: IReportingRepository

    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @MockBean
    private lateinit var semaphoreRepository: ISemaphoreRepository

    @MockBean
    private lateinit var facadeRepository: IFacadeAreasRepository

    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var postgisFunctionRepository: IPostgisFunctionRepository

    @MockBean
    private lateinit var applicationEventPublisher: ApplicationEventPublisher

    @Test
    fun `should return new or updated reporting`() {
        // Given
        val aReportingWithSemaphore = aReporting(reportingSources = listOf(aReportingSourceSemaphore()))
        val reportingWithSemaphoreDTO =
            ReportingDTO(reporting = aReporting(reportingSources = listOf(aReportingSourceControlUnit())), listOf())

        val aReportingWithControlUnit = aReporting(reportingSources = listOf(aReportingSourceControlUnit()))
        val reportingWithControlUnitDTO =
            ReportingDTO(reporting = aReportingWithControlUnit, reportingSources = listOf())

        val wktReader = WKTReader()
        val point = wktReader.read("POINT(-2.7335 47.6078)") as Point

        val semaphore =
            SemaphoreEntity(
                id = 1,
                name = "semaphore 1",
                geom = point,
            )
        val fullControlUnit =
            FullControlUnitDTO(
                administration =
                AdministrationEntity(
                    id = 1,
                    isArchived = false,
                    name = "administration 1",
                ),
                controlUnit =
                ControlUnitEntity(
                    id = 1,
                    administrationId = 2,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "control unit 1",
                    termsNote = null,
                ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            )

        given(reportingRepository.save(aReportingWithSemaphore))
            .willReturn(reportingWithSemaphoreDTO)
        given(reportingRepository.save(aReportingWithControlUnit))
            .willReturn(reportingWithControlUnitDTO)
        given(facadeRepository.findFacadeFromGeometry(aReportingWithSemaphore.geom!!)).willReturn("Facade 1")
        given(semaphoreRepository.findById(1)).willReturn(semaphore)
        given(controlUnitRepository.findById(1)).willReturn(fullControlUnit)
        given(postgisFunctionRepository.normalizeGeometry(aReportingWithSemaphore.geom!!)).willReturn(
            aReportingWithSemaphore.geom,
        )

        // When
        val createdReportingWithSemaphore =
            CreateOrUpdateReporting(
                reportingRepository = reportingRepository,
                facadeRepository = facadeRepository,
                postgisFunctionRepository = postgisFunctionRepository,
                eventPublisher = applicationEventPublisher,
            )
                .execute(aReportingWithSemaphore)

        // Then
        verify(postgisFunctionRepository, times(1)).normalizeGeometry(aReportingWithSemaphore.geom!!)
        verify(reportingRepository, times(1)).save(aReportingWithSemaphore)
        assertThat(createdReportingWithSemaphore).isEqualTo(reportingWithSemaphoreDTO)

        // When
        val createdReportingWithControlUnit =
            CreateOrUpdateReporting(
                reportingRepository = reportingRepository,
                facadeRepository = facadeRepository,
                postgisFunctionRepository = postgisFunctionRepository,
                eventPublisher = applicationEventPublisher,
            )
                .execute(aReportingWithControlUnit)

        // Then
        verify(reportingRepository, times(1)).save(aReportingWithControlUnit)
        assertThat(createdReportingWithControlUnit).isEqualTo(reportingWithControlUnitDTO)
    }

    @Test
    fun `Should throw an exception when sourceType is set to Semaphore and semaphoreId is null or controlUnitId & sourceName are not null`() {
        val reporting =
            aReporting(
                reportingSources = listOf(
                    ReportingSourceEntity(
                        id = null,
                        reportingId = null,
                        sourceType = SourceTypeEnum.SEMAPHORE,
                        semaphoreId = null,
                        controlUnitId = null,
                        sourceName = null,
                    ),
                ),
            )

        // When
        val throwable =
            Assertions.catchThrowable {
                CreateOrUpdateReporting(
                    reportingRepository = reportingRepository,
                    facadeRepository = facadeRepository,
                    postgisFunctionRepository = postgisFunctionRepository,
                    eventPublisher = applicationEventPublisher,
                )
                    .execute(reporting)
            }

        // Then
        assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwable.message)
            .contains("SemaphoreId must be set and controlUnitId and sourceName must be null")
    }

    @Test
    fun `Should throw an exception when sourceType is set to ControlUnit and controlUnitId is null or semaphoreId & sourceName are not null`() {
        // Given
        val reporting =
            aReporting(
                reportingSources = listOf(
                    ReportingSourceEntity(
                        id = null,
                        reportingId = null,
                        sourceType = SourceTypeEnum.CONTROL_UNIT,
                        semaphoreId = null,
                        controlUnitId = null,
                        sourceName = null,
                    ),
                ),
            )

        // When
        val throwable =
            Assertions.catchThrowable {
                CreateOrUpdateReporting(
                    reportingRepository = reportingRepository,
                    facadeRepository = facadeRepository,
                    postgisFunctionRepository = postgisFunctionRepository,
                    eventPublisher = applicationEventPublisher,
                )
                    .execute(reporting)
            }

        // Then
        assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwable.message)
            .contains("ControlUnitId must be set and semaphoreId and sourceName must be null")
    }

    @Test
    fun `should throw an exception if sourceType is set to OTHER and sourceName is null or controlUnitId or SemaphoreId is set`() {
        // Given
        val reportingWithControlUnitId =
            aReporting(
                reportingSources = listOf(
                    ReportingSourceEntity(
                        id = null,
                        reportingId = null,
                        sourceType = SourceTypeEnum.OTHER,
                        semaphoreId = null,
                        controlUnitId = 1,
                        sourceName = null,
                    ),
                ),
            )

        val reportingWithSemaphoreId =
            aReporting(
                reportingSources = listOf(
                    ReportingSourceEntity(
                        id = null,
                        reportingId = null,
                        sourceType = SourceTypeEnum.OTHER,
                        semaphoreId = 1,
                        controlUnitId = null,
                        sourceName = null,
                    ),
                ),
            )

        val reportingWithoutSourceName =
            aReporting(
                reportingSources = listOf(
                    ReportingSourceEntity(
                        id = null,
                        reportingId = null,
                        sourceType = SourceTypeEnum.OTHER,
                        semaphoreId = null,
                        controlUnitId = null,
                        sourceName = null,
                    ),
                ),
            )

        // When
        val throwableReportingWithControlUnitId =
            Assertions.catchThrowable {
                CreateOrUpdateReporting(
                    reportingRepository = reportingRepository,
                    facadeRepository = facadeRepository,
                    postgisFunctionRepository = postgisFunctionRepository,
                    eventPublisher = applicationEventPublisher,
                )
                    .execute(reportingWithControlUnitId)
            }

        // Then
        assertThat(throwableReportingWithControlUnitId)
            .isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwableReportingWithControlUnitId.message)
            .contains("SourceName must be set and semaphoreId and controlUnitId must be null")
        // When
        val throwableReportingWithSemaphoreId =
            Assertions.catchThrowable {
                CreateOrUpdateReporting(
                    reportingRepository = reportingRepository,
                    facadeRepository = facadeRepository,
                    postgisFunctionRepository = postgisFunctionRepository,
                    eventPublisher = applicationEventPublisher,
                )
                    .execute(reportingWithSemaphoreId)
            }

        // Then
        assertThat(throwableReportingWithSemaphoreId)
            .isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwableReportingWithSemaphoreId.message)
            .contains("SourceName must be set and semaphoreId and controlUnitId must be null")
        // When
        val throwableReportingWithoutSourceName =
            Assertions.catchThrowable {
                CreateOrUpdateReporting(
                    reportingRepository = reportingRepository,
                    facadeRepository = facadeRepository,
                    postgisFunctionRepository = postgisFunctionRepository,
                    eventPublisher = applicationEventPublisher,
                )
                    .execute(reportingWithoutSourceName)
            }

        // Then
        assertThat(throwableReportingWithoutSourceName)
            .isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwableReportingWithoutSourceName.message)
            .contains("SourceName must be set and semaphoreId and controlUnitId must be null")
    }

    @Test
    fun `execute should throw ReportingAlreadyAttachedException when try to attach reporting that has already be attached`() {
        val reportingWithNewAttachedMission =
            aReporting(id = 1, missionId = 1, attachedToMissionAtUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"))

        given(reportingRepository.findById(reportingWithNewAttachedMission.id!!))
            .willReturn(ReportingDTO(reporting = aReporting(id = 2, missionId = 2), reportingSources = listOf()))

        // Then
        assertThatThrownBy {
            CreateOrUpdateReporting(
                reportingRepository = reportingRepository,
                facadeRepository = facadeRepository,
                postgisFunctionRepository = postgisFunctionRepository,
                eventPublisher = applicationEventPublisher,
            )
                .execute(reportingWithNewAttachedMission)
        }
            .isInstanceOf(ReportingAlreadyAttachedException::class.java)
    }
}
