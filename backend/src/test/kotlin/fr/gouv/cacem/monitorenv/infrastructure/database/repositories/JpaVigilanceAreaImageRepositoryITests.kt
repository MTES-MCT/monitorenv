package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaVigilanceAreaImageRepositoryITests : AbstractDBTests() {

    @Autowired
    private lateinit var jpaVigilanceAreaImageRepository: JpaVigilanceAreaImageRepository

    @Test
    fun `should save image`() {
        val image = ImageEntity(
            vigilanceAreaId = 1,
            name = "test_image.jpg",
            content = byteArrayOf(1, 2, 3, 4),
            mimeType = "image/jpeg",
            size = 1024,
        )

        val savedImage = jpaVigilanceAreaImageRepository.save(image)

        assertThat(savedImage).isNotNull
        assertThat(savedImage!!.id).isNotNull()
        assertThat(savedImage.vigilanceAreaId).isEqualTo(1)
        assertThat(savedImage.name).isEqualTo("test_image.jpg")
        assertThat(savedImage.content).isEqualTo(byteArrayOf(1, 2, 3, 4))
        assertThat(savedImage.mimeType).isEqualTo("image/jpeg")
        assertThat(savedImage.size).isEqualTo(1024)
    }
}
