package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaPeriodEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaPeriodFixture.Companion.aVigilanceAreaPeriodEntity
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import java.time.ZonedDateTime

private val polygon =
    WKTReader()
        .read(
            "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
        ) as MultiPolygon

class VigilanceAreaFixture {
    companion object {
        fun aVigilanceAreaEntity(
            id: Int = 1,
            createdBy: String = "ABC",
            isDraft: Boolean = true,
            themes: List<ThemeEntity> = listOf(aTheme(id = 1, name = "AMP")),
            tags: List<TagEntity> = listOf(aTag(id = 1, name = "AMP")),
            startDate: ZonedDateTime? = ZonedDateTime.parse("2024-01-15T00:00:00Z"),
            endDate: ZonedDateTime? = ZonedDateTime.parse("2024-01-15T23:59:59Z"),
            frequency: FrequencyEnum? = FrequencyEnum.ALL_WEEKS,
            endingOccurenceDate: ZonedDateTime? = null,
            endCondition: EndingConditionEnum = EndingConditionEnum.OCCURENCES_NUMBER,
            endingOccurrencesNumber: Int? = 2,
            isAtAllTimes: Boolean = false,
            geom: MultiPolygon? = polygon,
            comments: String? = "Basic area comments",
            periods: List<VigilanceAreaPeriodEntity> =
                listOf(
                    aVigilanceAreaPeriodEntity(
                        startDate = startDate,
                        endDate = endDate,
                        frequency = frequency,
                        endingOccurrencesNumber = endingOccurrencesNumber,
                        endCondition = endCondition,
                        endingOccurenceDate = endingOccurenceDate,
                        isAtAllTimes = isAtAllTimes,
                    ),
                ),
        ): VigilanceAreaEntity =
            VigilanceAreaEntity(
                id = id,
                comments = comments,
                createdBy = createdBy,
                images = null,
                geom = geom,
                isDeleted = false,
                isDraft = isDraft,
                links = listOf(),
                linkedAMPs = listOf(1, 2),
                linkedRegulatoryAreas = listOf(1, 2),
                name = "Basic Area",
                sources = emptyList(),
                themes = themes,
                visibility = VisibilityEnum.PUBLIC,
                createdAt = null,
                updatedAt = null,
                tags = tags,
                validatedAt = null,
                periods = periods,
            )

        fun aVigilanceAreaEntityWithImagesAndLink(): VigilanceAreaEntity =
            VigilanceAreaEntity(
                id = 2,
                comments = "Basic area comments",
                createdBy = "ABC",
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
                geom = null,
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
                sources = emptyList(),
                themes = listOf(aTheme(id = 1, name = "AMP")),
                visibility = VisibilityEnum.PRIVATE,
                createdAt = null,
                updatedAt = null,
                tags = listOf(aTag(name = "AMP")),
                validatedAt = null,
                periods = listOf(aVigilanceAreaPeriodEntity()),
            )
    }
}
