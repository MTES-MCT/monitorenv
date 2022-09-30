package fr.gouv.cacem.monitorenv.infrastructure.database.repositories


import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader

class JpaFacadeAreasRepositoryTests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaFacadeAreasRepository: JpaFacadeAreasRepository

  @Test
  @Transactional
  fun `findFacadeFromMission Should return facade from mission geometry`() {

    // Given
    val wktReader = WKTReader()
    val multipolygonString =
      "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    val missionGeometry = wktReader.read(multipolygonString) as MultiPolygon


    // When
    val requestedFacade = jpaFacadeAreasRepository.findFacadeFromMission(missionGeometry)
    // Then
    assertThat(requestedFacade).isEqualTo("NAMO")
  }

}
