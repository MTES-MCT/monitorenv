package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test

class CreateOrUpdateVigilanceAreaUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    private val createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea =
        CreateOrUpdateVigilanceArea(
            vigilanceAreaRepository,
        )

    @Test
    fun `execute should return save() result`() {
        val image = ImageEntity(
            id = 1,
            vigilanceAreaId = 1,
            name = "test_image.jpg",
            content = byteArrayOf(1, 2, 3, 4),
            mimeType = "image/jpeg",
            size = 1024,
        )
        val newVigilanceArea =
            VigilanceAreaEntity(
                comments = "Comments",
                isArchived = false,
                isDeleted = false,
                isDraft = true,
                images = listOf(image),
            )

        val expectedVigilanceArea = newVigilanceArea.copy(id = 0)

        given(vigilanceAreaRepository.save(newVigilanceArea)).willReturn(expectedVigilanceArea)

        val result = createOrUpdateVigilanceArea.execute(newVigilanceArea)

        verify(vigilanceAreaRepository, times(1)).save(newVigilanceArea)
        Assertions.assertThat(result).isEqualTo(expectedVigilanceArea)
    }
}
