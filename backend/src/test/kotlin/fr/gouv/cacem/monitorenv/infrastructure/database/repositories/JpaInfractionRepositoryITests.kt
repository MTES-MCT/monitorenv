package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaInfractionRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaInfractionsRepository: JpaInfractionRepository

  @Test
  @Transactional
  fun `findInfractions Should return all control topics`() {
    // When
    val infractions = jpaInfractionsRepository.findInfractions()
    assertThat(infractions).hasSize(1056)
  }
}
