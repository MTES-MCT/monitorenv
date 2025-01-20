package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import java.time.ZonedDateTime

class VigilanceAreaFixture {
    companion object {
        fun aVigilanceAreaEntity(
            createdBy: String = "ABC",
            isDraft: Boolean = true,
            themes: List<String> = listOf("AMP"),
            startDate: ZonedDateTime? = ZonedDateTime.parse("2024-01-15T00:00:00Z"),
            endDate: ZonedDateTime? = ZonedDateTime.parse("2024-01-15T23:59:59Z"),
            frequency: FrequencyEnum? = FrequencyEnum.ALL_WEEKS,
            endingOccurenceDate: ZonedDateTime? = null,
            endCondition: EndingConditionEnum = EndingConditionEnum.OCCURENCES_NUMBER,
            endingOccurrencesNumber: Int? = 2,
            isAtAllTimes: Boolean = false,
        ): VigilanceAreaEntity {
            return VigilanceAreaEntity(
                id = 1,
                comments = "Basic area comments",
                computedEndDate = ZonedDateTime.parse("2024-01-25T00:00:00Z"),
                createdBy = createdBy,
                endDatePeriod = endDate,
                endingCondition = endCondition,
                endingOccurrenceDate = endingOccurenceDate,
                endingOccurrencesNumber = endingOccurrencesNumber,
                images = null,
                frequency = frequency,
                geom = null,
                isArchived = false,
                isDeleted = false,
                isDraft = isDraft,
                links = listOf(),
                linkedAMPs = listOf(1, 2),
                linkedRegulatoryAreas = listOf(1, 2),
                name = "Basic Area",
                source = "Internal",
                startDatePeriod = startDate,
                themes = themes,
                visibility = VisibilityEnum.PUBLIC,
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = isAtAllTimes,
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
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = false,
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
                createdAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                updatedAt = ZonedDateTime.parse("2024-01-01T12:00:00Z"),
                isAtAllTimes = false,
            )
        }
    }
}
