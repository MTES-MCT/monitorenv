package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.*
import java.time.ZonedDateTime

class VigilanceAreaFixture {
    companion object {
        fun aVigilanceAreaEntity(): VigilanceAreaEntity {
            return VigilanceAreaEntity(
                id = 1,
                comments = "Basic area comments",
                computedEndDate = ZonedDateTime.parse("2024-01-25T00:00:00Z"),
                createdBy = "ABC",
                endDatePeriod = ZonedDateTime.parse("2024-01-15T23:59:59Z"),
                endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = 2,
                images = null,
                frequency = FrequencyEnum.ALL_WEEKS,
                geom = null,
                isArchived = false,
                isDeleted = false,
                isDraft = true,
                links = listOf(),
                linkedAMPs = listOf(1, 2),
                linkedRegulatoryAreas = listOf(1, 2),
                name = "Basic Area",
                source = "Internal",
                startDatePeriod = ZonedDateTime.parse("2024-01-15T00:00:00Z"),
                themes = listOf("AMP"),
                visibility = VisibilityEnum.PUBLIC,
            )
        }

        fun aVigilanceAreaEntityWithImagesAndLink(): VigilanceAreaEntity {
            return VigilanceAreaEntity(
                id = 2,
                comments = "Basic area comments",
                computedEndDate = null,
                createdBy = "ABC",
                endDatePeriod = ZonedDateTime.parse("2024-01-15T23:59:59Z"),
                endingCondition = null,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = 2,
                images =
                listOf(
                    ImageEntity(
                        name = "image1.jpg",
                        content = byteArrayOf(1, 2, 3),
                        mimeType = "image/jpeg",
                        size = 1024,
                    ),
                    ImageEntity(
                        name = "image2.png",
                        content = byteArrayOf(4, 5, 6),
                        mimeType = "image/png",
                        size = 2048,
                    ),
                ),
                frequency = FrequencyEnum.NONE,
                geom = null,
                isArchived = false,
                isDeleted = false,
                isDraft = true,
                links =
                listOf(
                    LinkEntity(
                        linkUrl = "http://example.com/link1",
                        linkText = "Link 1",
                    ),
                    LinkEntity(
                        linkUrl = "http://example.com/link2",
                        linkText = "Link 2",
                    ),
                ),
                linkedAMPs = listOf(1, 2),
                linkedRegulatoryAreas = listOf(1, 2),
                name = "Basic Area",
                source = "Internal",
                startDatePeriod = ZonedDateTime.parse("2024-01-15T00:00:00Z"),
                themes = listOf("AMP"),
                visibility = VisibilityEnum.PRIVATE,
            )
        }

        fun anArchivedVigilanceAreaEntity(): VigilanceAreaEntity {
            return VigilanceAreaEntity(
                id = 3,
                comments = "Basic area comments",
                computedEndDate = null,
                createdBy = "ABC",
                endDatePeriod = ZonedDateTime.parse("2024-01-15T23:59:59Z"),
                endingCondition = null,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = 2,
                images = listOf(),
                frequency = FrequencyEnum.NONE,
                geom = null,
                isArchived = true,
                isDeleted = false,
                isDraft = true,
                links = listOf(),
                linkedAMPs = listOf(1, 2),
                linkedRegulatoryAreas = listOf(1, 2),
                name = "Basic Area",
                source = "Internal",
                startDatePeriod = ZonedDateTime.parse("2024-01-15T00:00:00Z"),
                themes = listOf("AMP"),
                visibility = VisibilityEnum.PRIVATE,
            )
        }
    }
}
