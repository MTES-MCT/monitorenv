package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.ReportTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.CreateOrUpdateInfractionsObservationsReport
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class CreateOrUpdateInfractionsObservationsReportUTests {
  @MockBean
  private lateinit var createOrUpdateInfractionsObservationsReportRepositoty: IInfractionsObservationsReportRepository

  @Test
  fun `Should throw an exception when input is null`(){
    // When
    val throwable = Assertions.catchThrowable {
      CreateOrUpdateInfractionsObservationsReport(createOrUpdateInfractionsObservationsReportRepositoty)
        .execute(null)
    }

    // Then
    assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
    assertThat(throwable.message).contains("No infractionObservationReport to create or update")
  }

  @Test
  fun `should return new or updated infractionObservationReport`() {
    // Given
    val wktReader = WKTReader()

    val multipolygonString = "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
    val polygon = wktReader.read(multipolygonString) as MultiPolygon

    val infractionObservationReport = InfractionsObservationsReportEntity(
      sourceType = SourceTypeEnum.SEMAPHORE,
      sourceName = "Semaphore 1",
      targetType = TargetTypeEnum.VEHICLE,
      vehicleType = VehicleTypeEnum.VESSEL,
      geom = polygon,
      description = "description",
      reportType = ReportTypeEnum.INFRACTION,
      theme = "theme",
      subThemes = listOf("subTheme1", "subTheme2"),
      actionTaken = "actions effectuées blabal ",
      isInfractionProven = true,
      isControlRequired = true,
      isUnitAvailable = true,
      createdAt = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      validityTime = 10,
      isDeleted = false
    )

    given(createOrUpdateInfractionsObservationsReportRepositoty.save(infractionObservationReport)).willReturn(infractionObservationReport)

    // When
    val createdInfractionObservationReport = CreateOrUpdateInfractionsObservationsReport(createOrUpdateInfractionsObservationsReportRepositoty)
      .execute(infractionObservationReport)

    //Then
    verify(createOrUpdateInfractionsObservationsReportRepositoty, times(1)).save(infractionObservationReport)
    assertThat(createdInfractionObservationReport).isEqualTo(infractionObservationReport)
  }
}