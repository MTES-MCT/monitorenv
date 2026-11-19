package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.PROHIBITION_PERIODS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.RESUME
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.TAGS
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum.THEMES
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagationOptionEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class JpaRegulatoryAreaGroupRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreaGroupRepository: JpaRegulatoryAreaGroupRepository

    @Test
    @Transactional
    fun `findAll Should return all regulatoryAreas`() {
        // When
        val regulatoryAreas = jpaRegulatoryAreaGroupRepository.findAll(SearchFilters())
        assertThat(regulatoryAreas.size).isEqualTo(9)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when onlyRecentsArea filter is set to TRUE`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(onlyRecentsAreas = true),
            )
        assertThat(regulatoryAreas.size).isEqualTo(8)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to NAMO`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(seaFronts = listOf("NAMO")),
            )
        assertThat(regulatoryAreas.size).isEqualTo(8)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when query filter is set to Dragage`() {
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(query = "Dragage"),
            )
        assertThat(regulatoryAreas).hasSize(1)
        assertThat(regulatoryAreas[0].areas).hasSize(2)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when lastModification filter is set to in a month`() {
        val lastModificationFrom = ZonedDateTime.now().minusDays(30)
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                SearchFilters(
                    lastModificationFrom = lastModificationFrom.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                ),
            )
        assertThat(regulatoryAreas).hasSize(4)
        assertThat(regulatoryAreas.flatMap { it.areas }.map { it.editionBo }).allMatch {
            it?.isBefore(
                lastModificationFrom,
            ) == true
        }
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when lastModification custom filter is set`() {
        val lastModificationFrom = ZonedDateTime.now().plusDays(1)
        val lastModificationTo = ZonedDateTime.now().minusDays(1)
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                SearchFilters(
                    lastModificationFrom = lastModificationFrom.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                    lastModificationTo = lastModificationTo.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                ),
            )
        assertThat(regulatoryAreas).hasSize(3)
        assertThat(regulatoryAreas.flatMap { it.areas }).hasSize(4)
        assertThat(regulatoryAreas.flatMap { it.areas }.map { it.editionBo }).allMatch {
            it?.isBefore(
                lastModificationFrom,
            ) == true &&
                it.isAfter(lastModificationTo)
        }
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to MED`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(
                filters = SearchFilters(seaFronts = listOf("MED")),
            )

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when tags filter is set to 'subtagMouillage1'`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(SearchFilters(tags = listOf(10)))

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(2)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when themes filter is set to 'Pêche à pied'`() {
        // When
        val regulatoryAreas =
            jpaRegulatoryAreaGroupRepository.findAll(SearchFilters(themes = listOf(9)))

        // Then
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }

    @Test
    fun `findAllLayerNames should return all layer names`() {
        // When
        val layerNames = jpaRegulatoryAreaGroupRepository.findAllLayerNames()

        // Then
        assertThat(layerNames).hasSize(9)
        assertThat(layerNames.map { it.group.layerName + " - " + it.group.location }).containsExactlyInAnyOrder(
            "Dragage - port de Brest",
            "Granulats Marins - Le Minou",
            "Interdiction VNM - Molene",
            "Mouillage - Conquet Ile de bannec",
            "Mouillage interdiction - port Camaret",
            "RNN - Iroise",
            "ZMEL - anse illien Ploumoguer",
            "ZMEL - Cale Querlen",
            "ZMEL - maison blanche",
        )
    }

    @Test
    @Transactional
    fun `save should save the group values and copy only the given fields to its regulatory areas`() {
        // Given
        val existingGroup = requireNotNull(jpaRegulatoryAreaGroupRepository.findGroupByRegulatoryAreaId(17))
        val previousAreas = requireNotNull(jpaRegulatoryAreaGroupRepository.findGroupById(existingGroup.id)).areas
        val regulatoryAreaIds = previousAreas.map { it.id }
        val group =
            RegulatoryAreaGroupEntity(
                id = existingGroup.id,
                layerName = existingGroup.layerName,
                location = existingGroup.location,
                date = null,
                dateFin = null,
                refReg = existingGroup.refReg,
                type = null,
                url = null,
                regulatoryAreaIds = regulatoryAreaIds,
                themes = listOf(aTheme(id = 9)),
                tags = listOf(aTag(id = 1)),
                resume = "Résumé du groupe",
                prohibitionPeriods = "Interdit l'hiver",
                propagation =
                    mapOf(
                        THEMES to PropagationOptionEntity(enabled = true, overwriteExisting = true),
                        RESUME to PropagationOptionEntity(enabled = true, overwriteExisting = true),
                        PROHIBITION_PERIODS to PropagationOptionEntity(enabled = true, overwriteExisting = false),
                        TAGS to PropagationOptionEntity(enabled = false),
                    ),
            )

        // When
        val savedGroup = jpaRegulatoryAreaGroupRepository.save(group, setOf(THEMES, RESUME))

        // Then
        assertThat(savedGroup.group.resume).isEqualTo("Résumé du groupe")
        assertThat(savedGroup.group.prohibitionPeriods).isEqualTo("Interdit l'hiver")
        assertThat(savedGroup.group.themes.map { it.id }).containsExactly(9)
        assertThat(savedGroup.group.tags.map { it.id }).containsExactly(1)
        assertThat(savedGroup.group.propagatedFields).containsExactly(THEMES, RESUME, PROHIBITION_PERIODS)

        assertThat(savedGroup.areas.map { it.id }).containsExactlyInAnyOrderElementsOf(regulatoryAreaIds)
        savedGroup.areas.forEach { area ->
            val previousArea = previousAreas.first { it.id == area.id }
            // Copied fields
            assertThat(area.themes.map { it.id }).containsExactly(9)
            assertThat(area.resume).isEqualTo("Résumé du groupe")
            // Not copied fields
            assertThat(area.prohibitionPeriods).isEqualTo(previousArea.prohibitionPeriods)
            assertThat(area.tags).isEqualTo(previousArea.tags)
        }
    }
}
