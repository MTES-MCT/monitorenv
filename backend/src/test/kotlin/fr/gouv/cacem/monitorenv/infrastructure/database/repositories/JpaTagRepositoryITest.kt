package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRepository
import jakarta.persistence.EntityManager
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

class JpaTagRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaTagRepository: JpaTagRepository

    @Autowired
    private lateinit var dbTagRepository: IDBTagRepository

    @Autowired
    private lateinit var entityManager: EntityManager

    @Test
    fun `findAllWithin should return all tags with subTags within validity range time`() {
        // Given
        val expectedTagSize = 7

        // When
        val tags = jpaTagRepository.findAllWithin(ZonedDateTime.now())

        // Then
        assertEquals(expectedTagSize, tags.size)
        tags.forEach { tag ->
            assertThat(tag.endedAt == null || tag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            tag.subTags.forEach { subTag ->
                assertThat(subTag.endedAt == null || subTag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }

    @Test
    fun `findAllWithin should not return themes when validity range time is out of range`() {
        // Given
        val expectedTagSize = 0

        // When
        val tags = jpaTagRepository.findAllWithin(ZonedDateTime.parse("2099-12-31T00:00:00+00:00"))

        // Then
        assertEquals(expectedTagSize, tags.size)
    }

    @Transactional
    @Test
    fun `findAllWithinByRegulatoryAreaIds should return all regulatory tags with regulatory subTags within validity range time`() {
        // Given
        val regulatoryAreaIds = listOf(16, 17)
        val expectedTagSize = 3

        // When
        val regulatoryTags = jpaTagRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds)

        // Then
        assertEquals(expectedTagSize, regulatoryTags.size)
        regulatoryTags.forEach { regulatoryTag ->
            // Clear cache otherwise we have not all subtags
            entityManager.clear()
            val baseTag = dbTagRepository.findByIdOrNull(regulatoryTag.id)
            assertThat(baseTag?.subTags).hasSizeGreaterThanOrEqualTo(regulatoryTag.subTags.size)
            assertThat(regulatoryTag.endedAt == null || regulatoryTag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            regulatoryTag.subTags.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }
}
