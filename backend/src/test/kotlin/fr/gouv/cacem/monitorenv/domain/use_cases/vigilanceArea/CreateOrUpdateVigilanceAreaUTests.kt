package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.argThat
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateVigilanceAreaUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    private val facadeAreasRepository: IFacadeAreasRepository = mock()

    private val createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea =
        CreateOrUpdateVigilanceArea(
            vigilanceAreaRepository,
            facadeAreasRepository,
        )

    @Test
    fun `execute should return save() result`(log: CapturedOutput) {
        val image =
            ImageEntity(
                id = 1,
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
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = false,
                name = "test_name",
                tags = emptyList(),
                themes = emptyList(),
                sources = emptyList(),
                validatedAt = null,
            )

        val expectedVigilanceArea = newVigilanceArea.copy(id = 0)

        given(vigilanceAreaRepository.save(newVigilanceArea)).willReturn(expectedVigilanceArea)

        val result = createOrUpdateVigilanceArea.execute(newVigilanceArea)

        verify(vigilanceAreaRepository, times(1)).save(newVigilanceArea)
        assertThat(result).isEqualTo(expectedVigilanceArea)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE vigilance area ${newVigilanceArea.id}")
        assertThat(log.out).contains("Vigilance area ${result.id} created or updated")
    }

    @Test
    fun `execute should set archive to false then save vigilance area when it is archived and computedEndDate is in the future`() {
        val isArchived = true
        val computedEndDate = ZonedDateTime.now().plusHours(1)
        val archivedVigilanceArea =
            VigilanceAreaEntity(
                id = 0,
                comments = "Comments",
                isArchived = isArchived,
                isDeleted = false,
                isDraft = true,
                computedEndDate = computedEndDate,
                images = listOf(),
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = false,
                name = "test_name",
                tags = emptyList(),
                themes = emptyList(),
                sources = emptyList(),
                validatedAt = null,
            )

        given(vigilanceAreaRepository.save(any())).willReturn(archivedVigilanceArea)

        createOrUpdateVigilanceArea.execute(archivedVigilanceArea)

        verify(vigilanceAreaRepository, times(1)).save(argThat { vigilanceArea -> !vigilanceArea.isArchived })
    }

    @Test
    fun `execute should set archive to false then save vigilance area when it is archived and is at all times`() {
        val isArchived = true
        val isAtAllTimes = true
        val archivedVigilanceArea =
            VigilanceAreaEntity(
                id = 0,
                comments = "Comments",
                isArchived = isArchived,
                isDeleted = false,
                isDraft = true,
                images = listOf(),
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = isAtAllTimes,
                name = "test_name",
                tags = emptyList(),
                themes = emptyList(),
                sources = emptyList(),
                validatedAt = null,
            )

        given(vigilanceAreaRepository.save(any())).willReturn(archivedVigilanceArea)

        createOrUpdateVigilanceArea.execute(archivedVigilanceArea)

        verify(vigilanceAreaRepository, times(1)).save(argThat { vigilanceArea -> !vigilanceArea.isArchived })
    }
}
