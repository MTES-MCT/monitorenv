package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

class JpaOperationRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaOperationRepository: JpaOperationRepository

  @Test
  @Transactional
  fun `findOperations Should return all operations`() {
    // When
    val operations = jpaOperationRepository.findOperations()

    assertThat(operations).hasSize(50)
  }

  @Test
  @Transactional
  fun `save Should update operation`() {

    // Given
    val firstOperation = OperationEntity(
      0,
      "SEA",
      "CLOSED",
      "Outre-Mer",
      "CONTROLE",
      ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      110.126782000000006,
      -50.373736000000001
    )
    val expectedUpdatedOperation = OperationEntity(
      0, "LAND", "CLOSED", "Outre-Mer", "CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      ZonedDateTime.parse("2022-01-23T20:29:03Z"), 110.126782000000006, -50.373736000000001
    )
    // When
//        assertThat(jpaOperationRepository.findOperationById(0)).isEqualTo(firstOperation)
    val operation = jpaOperationRepository.save(expectedUpdatedOperation)
    assertThat(jpaOperationRepository.findOperationById(0)).isEqualTo(expectedUpdatedOperation)

  }

}
