package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionTagFixture.Companion.aMissionTagEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaMissionTagsRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaMissionTagsRepository: JpaMissionTagsRepository

    @Test
    @Transactional
    fun `findAll should return all mission tags`() {
        // Given
        val totalMissionTags = 5

        // When
        val missionTags = jpaMissionTagsRepository.findAll()

        // Then
        assertThat(missionTags.size).isEqualTo(totalMissionTags)
    }

    @Test
    @Transactional
    fun `save should return the persisted mission tag`() {
        // Given
        val aMissionTag = aMissionTagEntity(id = null)

        // When
        val savedMissionTag = jpaMissionTagsRepository.save(aMissionTag)

        // Then
        assertThat(savedMissionTag.id).isNotNull()
        assertThat(savedMissionTag).usingRecursiveComparison().ignoringFields("id").isEqualTo(aMissionTag)
    }
}
