package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.config.CustomQueryCountListener
import fr.gouv.cacem.monitorenv.config.DataSourceProxyBeanPostProcessor
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Import(DataSourceProxyBeanPostProcessor::class)
class JpaVigilanceAreaRepositoryITests : AbstractDBTests() {
    @Autowired
    private val customQueryCountListener: CustomQueryCountListener? = null

    @Autowired
    private lateinit var jpaVigilanceAreaRepository: JpaVigilanceAreaRepository

    @BeforeEach
    fun setUp() {
        customQueryCountListener!!.resetQueryCount() // Reset the count before each test
    }

    @Test
    @Transactional
    fun `findAll Should return all vigilance areas`() {
        // When
        val vigilanceAreas = jpaVigilanceAreaRepository.findAll()

        val queryCount = customQueryCountListener?.getQueryCount()
        println("Number of Queries Executed: $queryCount")

        // Then
        assertThat(vigilanceAreas.size).isEqualTo(9)
    }

    @Test
    @Transactional
    fun `findById should return specific vigilance area`() {
        // Given
        val expectedVigilanceAreaId = 1
        // When
        val vigilanceArea = jpaVigilanceAreaRepository.findById(expectedVigilanceAreaId)
        // Then
        assertThat(vigilanceArea?.id).isEqualTo(expectedVigilanceAreaId)
        assertThat(vigilanceArea?.comments).isEqualTo("Commentaire sur la zone de vigilance")
        assertThat(vigilanceArea?.createdBy).isEqualTo("ABC")
        assertThat(vigilanceArea?.endingCondition).isEqualTo(null)
        assertThat(vigilanceArea?.geom).isNotNull()
        assertThat(vigilanceArea?.isDeleted).isFalse()
        assertThat(vigilanceArea?.isDraft).isFalse()
        assertThat(vigilanceArea?.links?.get(0)?.linkText).isEqualTo("lien vers arrêté réfectoral")
        assertThat(vigilanceArea?.links?.get(0)?.linkUrl).isEqualTo("www.google.fr")
        assertThat(vigilanceArea?.sources[0]?.name).isEqualTo("Unité BSN Ste Maxime")
        assertThat(vigilanceArea?.name).isEqualTo("Zone de vigilance 1")
        assertThat(vigilanceArea?.themes).isEmpty()
        assertThat(vigilanceArea?.visibility).isEqualTo(VisibilityEnum.PUBLIC)
        assertThat(vigilanceArea?.tags).hasSize(3)
        assertThat(vigilanceArea?.tags?.get(0)?.id).isEqualTo(5)
        assertThat(vigilanceArea?.tags?.get(0)?.name).isEqualTo("Mouillage")
        assertThat(
            vigilanceArea
                ?.tags
                ?.get(0)
                ?.subTags
                ?.get(0)
                ?.id,
        ).isEqualTo(11)
        assertThat(
            vigilanceArea
                ?.tags
                ?.get(0)
                ?.subTags
                ?.get(0)
                ?.name,
        ).isEqualTo("subtagMouillage2")
        assertThat(vigilanceArea?.tags?.get(1)?.id).isEqualTo(6)
        assertThat(vigilanceArea?.tags?.get(1)?.name).isEqualTo("Extraction granulats")
        assertThat(vigilanceArea?.tags?.get(2)?.id).isEqualTo(7)
        assertThat(vigilanceArea?.tags?.get(2)?.name).isEqualTo("Dragage")
    }

    @Test
    @Transactional
    fun `save should create vigilance area`() {
        // Given
        val vigilanceArea =
            VigilanceAreaEntity(
                name = "Nouvelle zone de vigilance",
                isArchived = false,
                isDeleted = false,
                isDraft = true,
                comments = "Commentaires sur la zone de vigilance",
                createdBy = "ABC",
                endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = 2,
                frequency = FrequencyEnum.ALL_WEEKS,
                endDatePeriod = ZonedDateTime.parse("2024-08-08T23:59:59Z"),
                geom = null,
                images =
                    listOf(
                        ImageEntity(
                            content = byteArrayOf(1, 2, 3, 4),
                            mimeType = "image/jpeg",
                            name = "test_image.jpg",
                            size = 1024,
                        ),
                    ),
                links = null,
                sources =
                    listOf(
                        VigilanceAreaSourceEntity(
                            id = null,
                            name = "Source de la zone de vigilance",
                            phone = null,
                            email = null,
                            controlUnitContacts = null,
                        ),
                    ),
                startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
                visibility = VisibilityEnum.PRIVATE,
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = false,
                tags = listOf(aTag(id = 5)),
                themes = listOf(aTheme(id = 9)),
                validatedAt = ZonedDateTime.parse("2025-01-01T00:00:00Z"),
            )

        // When
        val savedVigilanceArea = jpaVigilanceAreaRepository.save(vigilanceArea)

        // Then
        assertThat(savedVigilanceArea.id).isNotZero() // id should be generated after save
        assertThat(savedVigilanceArea.comments).isEqualTo("Commentaires sur la zone de vigilance")
        assertThat(savedVigilanceArea.createdBy).isEqualTo("ABC")
        assertThat(savedVigilanceArea.endDatePeriod)
            .isEqualTo(ZonedDateTime.parse("2024-08-08T23:59:59Z"))
        assertThat(savedVigilanceArea.endingCondition).isEqualTo(EndingConditionEnum.OCCURENCES_NUMBER)
        assertThat(savedVigilanceArea.frequency).isEqualTo(FrequencyEnum.ALL_WEEKS)
        assertThat(savedVigilanceArea.geom).isNull()
        assertThat(savedVigilanceArea.isDeleted).isFalse()
        assertThat(savedVigilanceArea.isDraft).isTrue()
        assertThat(savedVigilanceArea.links).isNull()
        assertThat(savedVigilanceArea.sources[0].name).isEqualTo("Source de la zone de vigilance")
        assertThat(savedVigilanceArea.name).isEqualTo("Nouvelle zone de vigilance")
        assertThat(savedVigilanceArea.startDatePeriod)
            .isEqualTo(ZonedDateTime.parse("2024-08-18T00:00:00Z"))
        assertThat(savedVigilanceArea.visibility).isEqualTo(VisibilityEnum.PRIVATE)
        assertThat(savedVigilanceArea.createdAt).isNotNull()
        assertThat(savedVigilanceArea.updatedAt).isNull()
        assertThat(savedVigilanceArea.isAtAllTimes).isFalse()
        assertThat(savedVigilanceArea.tags).hasSize(1)
        assertThat(savedVigilanceArea.tags[0].name).isEqualTo("Mouillage")
        assertThat(savedVigilanceArea.tags[0].id).isEqualTo(5)
        assertThat(savedVigilanceArea.themes).hasSize(1)
        assertThat(savedVigilanceArea.themes[0].name).isEqualTo("Pêche à pied")
        assertThat(savedVigilanceArea.themes[0].id).isEqualTo(9)
        assertThat(savedVigilanceArea.validatedAt)
            .isEqualTo(ZonedDateTime.parse("2025-01-01T00:00:00Z"))
    }

    @Test
    @Transactional
    fun `save should update vigilance area`() {
        // Given
        val vigilanceArea = jpaVigilanceAreaRepository.findById(5)
        val controlUnitContact =
            ControlUnitContactEntity(
                id = 1,
                controlUnitId = 10000,
                email = "email_1",
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = false,
                name = "Contact 1",
                phone = "0601xxxxxx",
            )
        val updatedVigilanceArea =
            vigilanceArea!!.copy(
                name = "Zone de vigilance mise à jour",
                sources =
                    listOf(
                        VigilanceAreaSourceEntity(
                            id = null,
                            controlUnitContacts = listOf(controlUnitContact),
                            name = null,
                            email = null,
                            phone = null,
                        ),
                    ),
                isDraft = false,
            )

        // When
        val savedVigilanceArea = jpaVigilanceAreaRepository.save(updatedVigilanceArea)

        // Then
        assertThat(savedVigilanceArea.id).isEqualTo(5) // id should be generated after save
        assertThat(savedVigilanceArea.createdBy).isEqualTo("ABC")
        assertThat(savedVigilanceArea.comments)
            .isEqualTo(
                "Proin maximus luctus urna, sit amet pellentesque diam porta ac. Praesent nisi urna, volutpat vitae consectetur et, aliquet non nisi. Sed molestie metus nec bibendum dignissim. In hac habitasse platea dictumst. Donec eu egestas nulla.",
            )
        assertThat(savedVigilanceArea.frequency).isEqualTo(FrequencyEnum.NONE)
        assertThat(savedVigilanceArea.endingCondition).isNull()
        assertThat(savedVigilanceArea.isDeleted).isFalse()
        assertThat(savedVigilanceArea.isDraft).isFalse()
        assertThat(savedVigilanceArea.links).isNull()
        assertThat(savedVigilanceArea.sources[0].controlUnitContacts).contains(controlUnitContact)
        assertThat(savedVigilanceArea.name).isEqualTo("Zone de vigilance mise à jour")
        assertThat(savedVigilanceArea.tags[0].id).isEqualTo(1)
        assertThat(savedVigilanceArea.tags[1].id).isEqualTo(2)
        assertThat(savedVigilanceArea.themes).isEmpty()
        assertThat(savedVigilanceArea.visibility).isEqualTo(VisibilityEnum.PRIVATE)
        assertThat(savedVigilanceArea.updatedAt).isNotNull()
    }

    @Test
    @Transactional
    fun `delete should soft delete vigilance area`() {
        // Given
        val vigilanceAreaId = 1

        val foundVigilanceArea = jpaVigilanceAreaRepository.findById(vigilanceAreaId)
        assertThat(foundVigilanceArea).isNotNull

        // When
        jpaVigilanceAreaRepository.delete(vigilanceAreaId)

        // Then
        val deletedVigilanceArea = jpaVigilanceAreaRepository.findById(vigilanceAreaId)
        assertThat(deletedVigilanceArea?.isDeleted).isTrue()
    }

    @Test
    @Transactional
    fun `archive should archive outdated vigilance areas`() {
        // Given
        val existingVigilanceArea = jpaVigilanceAreaRepository.findById(5)
        assertThat(existingVigilanceArea?.isArchived).isEqualTo(false)
        // When
        jpaVigilanceAreaRepository.archiveOutdatedVigilanceAreas()
        // Then
        val archivedVigilanceArea = jpaVigilanceAreaRepository.findById(5)
        assertThat(archivedVigilanceArea?.isArchived).isEqualTo(true)
    }

    @Test
    @Transactional
    fun `archive should not archive limitless vigilance areas`() {
        // Given
        val limitlessVigilanceArea =
            VigilanceAreaFixture.aVigilanceAreaEntity().copy(id = null, isAtAllTimes = true)
        val savedVigilanceArea = jpaVigilanceAreaRepository.save(limitlessVigilanceArea)
        // When
        jpaVigilanceAreaRepository.archiveOutdatedVigilanceAreas()
        // Then
        val archivedVigilanceArea = jpaVigilanceAreaRepository.findById(savedVigilanceArea.id!!)
        assertThat(archivedVigilanceArea?.isArchived).isEqualTo(false)
    }

    @Test
    fun `findAllByGeometry should return all vigilance areas that intersect the geometry `() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-3.50463204 48.93860679, -3.24829507 48.95623935, -3.48444629 48.99696455, -3.50463204 48.93860679)), ((-1.48966457 44.68844011, -1.14756914 44.95245914, -1.12016359 44.51220645, -1.48966457 44.68844011)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val vigilanceAreas = jpaVigilanceAreaRepository.findAllIdsByGeometryAndIsDraftIsFalse(polygon)

        val queryCount = customQueryCountListener?.getQueryCount()
        println("Number of Queries Executed: $queryCount")

        // Then
        assertThat(vigilanceAreas).hasSize(1)
        assertThat(vigilanceAreas[0]).isEqualTo(8)
    }

    @Test
    fun `findAllTrigrams should return all vigilance areas trigrams`() {
        // When
        val trigrams = jpaVigilanceAreaRepository.findAllTrigrams()

        // Then
        assertThat(trigrams).hasSize(4)
    }
}
