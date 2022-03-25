package fr.gouv.cacem.monitorenv.infrastructure.database.repositories


import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional


class JpaRegulatoryAreaRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaRegulatoryAreasRepository: JpaRegulatoryAreaRepository

  @Test
  @Transactional
  fun `findRegulatoryAreas Should return all regulatoryAreas`() {
    // When
    // val regulatoryAreas = jpaRegulatoryAreasRepository.findRegulatoryAreas()
    val regulatoryAreas = jpaRegulatoryAreasRepository.findTest()
    println("--------")
    println(regulatoryAreas)
    println("--------")
    assertThat(regulatoryAreas).hasSize(1)
  }

  @Test
  @Transactional
  fun `findRegulatoryAreaById Should return specific RegulatoryArea`() {

    // Given

    // When
//        assertThat(jpaOperationRepository.findOperationById(0)).isEqualTo(firstOperation)

  }

}
