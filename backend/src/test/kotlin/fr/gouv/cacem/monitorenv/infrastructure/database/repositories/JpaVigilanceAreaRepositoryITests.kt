package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.config.CustomQueryCountListener
import fr.gouv.cacem.monitorenv.config.DataSourceProxyBeanPostProcessor
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
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
        assertThat(vigilanceArea?.source).isEqualTo("Unité BSN Ste Maxime")
        assertThat(vigilanceArea?.name).isEqualTo("Zone de vigilance 1")
        assertThat(vigilanceArea?.themes).isEqualTo(listOf("Dragage", "Extraction granulats"))
        assertThat(vigilanceArea?.visibility).isEqualTo(VisibilityEnum.PUBLIC)
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
                source = "Source de la zone de vigilance",
                startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
                themes = null,
                visibility = VisibilityEnum.PRIVATE,
                createdAt = null,
                updatedAt = null,
                isAtAllTimes = false,
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
        assertThat(savedVigilanceArea.source).isEqualTo("Source de la zone de vigilance")
        assertThat(savedVigilanceArea.name).isEqualTo("Nouvelle zone de vigilance")
        assertThat(savedVigilanceArea.startDatePeriod)
            .isEqualTo(ZonedDateTime.parse("2024-08-18T00:00:00Z"))
        assertThat(savedVigilanceArea.themes).isNull()
        assertThat(savedVigilanceArea.visibility).isEqualTo(VisibilityEnum.PRIVATE)
        assertThat(savedVigilanceArea.createdAt).isNotNull()
        assertThat(savedVigilanceArea.updatedAt).isNull()
        assertThat(savedVigilanceArea.isAtAllTimes).isFalse()
    }

    @Test
    @Transactional
    fun `save should update vigilance area`() {
        // Given
        val vigilanceArea = jpaVigilanceAreaRepository.findById(5)
        val updatedVigilanceArea =
            vigilanceArea!!.copy(
                name = "Zone de vigilance mise à jour",
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
        assertThat(savedVigilanceArea.source).isNull()
        assertThat(savedVigilanceArea.name).isEqualTo("Zone de vigilance mise à jour")
        assertThat(savedVigilanceArea.themes).isEqualTo(listOf("AMP", "PN"))
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
    fun `findAllByGeometry should return all vigilance areas that intersect the geometry `() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-3.50463204 48.93860679, -3.24829507 48.95623935, -3.48444629 48.99696455, -3.50463204 48.93860679)), ((-1.48966457 44.68844011, -1.14756914 44.95245914, -1.12016359 44.51220645, -1.48966457 44.68844011)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        // When
        val vigilanceAreas = jpaVigilanceAreaRepository.findAllIdsByGeometry(polygon)

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
