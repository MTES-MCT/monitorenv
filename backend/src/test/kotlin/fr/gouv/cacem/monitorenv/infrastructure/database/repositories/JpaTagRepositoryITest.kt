package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
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
        val expectedTagSize = 15
        val startedAt = ZonedDateTime.now()
        val endedAt = ZonedDateTime.now()

        // When
        val tags = jpaTagRepository.findAllWithin(startedAt, endedAt)

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
    fun `findAllWithin should not return tags when validity range time is out of range`() {
        // Given
        val expectedTagSize = 8
        val startedAt = ZonedDateTime.parse("2100-01-01T00:00:00Z")
        val endedAt = ZonedDateTime.parse("2101-01-01T00:00:00Z")

        // When
        val tags = jpaTagRepository.findAllWithin(startedAt, endedAt)

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
            val baseTag = dbTagRepository.findByIdOrNull(regulatoryTag.id!!)
            assertThat(baseTag?.subTags).hasSizeGreaterThanOrEqualTo(regulatoryTag.subTags.size)
            assertThat(regulatoryTag.endedAt == null || regulatoryTag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            regulatoryTag.subTags.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }

    @Transactional
    @Test
    fun `findAllWithinByVigilanceAreasIds should return all vigilance areas tags with subTags within validity range time`() {
        // Given
        val vigilanceAreasIds = listOf(1, 2, 3)
        val expectedTagSize = 7

        // When
        val regulatoryAndVigilanceTags =
            jpaTagRepository.findAllWithinByVigilanceAreasIds(
                vigilanceAreasIds,
            )

        // Then
        assertEquals(expectedTagSize, regulatoryAndVigilanceTags.size)
        regulatoryAndVigilanceTags.forEach { tag ->
            // Clear cache otherwise we have not all subtags
            entityManager.clear()
            val baseTag = dbTagRepository.findByIdOrNull(tag.id!!)
            assertThat(baseTag?.subTags).hasSizeGreaterThanOrEqualTo(tag.subTags.size)
            assertThat(tag.endedAt == null || tag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            tag.subTags.forEach { subTag ->
                assertThat(subTag.endedAt == null || subTag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }

    @Transactional
    @Test
    fun `save should return the persisted tag`() {
        // Given
        val tag =
            aTag(
                id = null,
                name = "tag",
                startedAt = ZonedDateTime.parse("2023-01-01T00:00:00Z"),
                endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                subTags = emptyList(),
            )

        // When
        val savedTag = jpaTagRepository.save(tag, null)

        // Then
        assertThat(savedTag).usingRecursiveComparison().ignoringFields("id").isEqualTo(tag)
        assertThat(savedTag.id).isNotNull()
    }

    @Transactional
    @Test
    fun `save should return the persisted subTag`() {
        // Given
        val parentId = 1
        val subTag =
            aTag(
                id = null,
                name = "subTag",
                startedAt = ZonedDateTime.parse("2023-01-01T00:00:00Z"),
                endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                subTags = emptyList(),
            )

        // When
        val savedSubTag = jpaTagRepository.save(subTag, parentId)

        // Then
        assertThat(savedSubTag).usingRecursiveComparison().ignoringFields("id").isEqualTo(subTag)
        assertThat(savedSubTag.id).isNotNull()

        val tag = dbTagRepository.findByIdOrNull(parentId)

        assertThat(tag?.subTags).hasSize(3)
        assertThat(tag?.subTags[tag.subTags.size - 1]?.id).isEqualTo(savedSubTag.id)
    }
}
