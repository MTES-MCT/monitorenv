package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaModel.Companion.fromTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeVigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeVigilanceAreaModel.Companion.fromThemeEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaImageModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaSourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaSourceRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVigilanceAreaRepository(
    private val dbVigilanceAreaRepository: IDBVigilanceAreaRepository,
    private val dbVigilanceAreaSourceRepository: IDBVigilanceAreaSourceRepository,
    private val controlUnitContactRepository: IDBControlUnitContactRepository,
    private val dbTagVigilanceAreaRepository: IDBTagVigilanceAreaRepository,
    private val dbThemeVigilanceAreaRepository: IDBThemeVigilanceAreaRepository,
) : IVigilanceAreaRepository {
    @Transactional
    override fun findById(id: Int): VigilanceAreaEntity? =
        dbVigilanceAreaRepository.findByIdOrNull(id)?.toVigilanceAreaEntity()

    @Transactional
    override fun save(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity {
        val vigilanceAreaModel: VigilanceAreaModel = VigilanceAreaModel.fromVigilanceArea(vigilanceArea)
        addImages(vigilanceArea.images, vigilanceAreaModel)
        val savedVigilanceArea = dbVigilanceAreaRepository.saveAndFlush(vigilanceAreaModel)
        val savedTags = saveTags(savedVigilanceArea, vigilanceArea.tags)
        val savedThemes = saveThemes(savedVigilanceArea, vigilanceArea.themes)
        val savedSources = saveSources(savedVigilanceArea, vigilanceArea.sources)

        return savedVigilanceArea
            .copy(tags = savedTags, themes = savedThemes, sources = savedSources)
            .toVigilanceAreaEntity()
    }

    private fun addImages(
        images: List<ImageEntity>?,
        vigilanceAreaModel: VigilanceAreaModel,
    ) {
        val vigilanceAreaImagesModel =
            images?.map {
                VigilanceAreaImageModel.fromVigilanceAreaImageEntity(
                    it,
                    vigilanceAreaModel,
                )
            }

        vigilanceAreaModel.images.addAll(vigilanceAreaImagesModel ?: emptyList())
    }

    private fun saveSources(
        vigilanceAreaModel: VigilanceAreaModel,
        sources: List<VigilanceAreaSourceEntity>,
    ): List<VigilanceAreaSourceModel> {
        vigilanceAreaModel.id?.let {
            dbVigilanceAreaSourceRepository.deleteAllByVigilanceAreaId(it)
        }
        val vigilanceAreaSourceModels = fromVigilanceAreaSources(vigilanceAreaModel, sources)

        return dbVigilanceAreaSourceRepository.saveAll(vigilanceAreaSourceModels)
    }

    private fun fromVigilanceAreaSources(
        vigilanceAreaModel: VigilanceAreaModel,
        sources: List<VigilanceAreaSourceEntity>,
    ): List<VigilanceAreaSourceModel> =
        sources.flatMap { source ->
            return@flatMap if (!source.controlUnitContacts.isNullOrEmpty()) {
                source.controlUnitContacts.map {
                    val controlUnitContactModel =
                        if (it.id != null) controlUnitContactRepository.getReferenceById(it.id) else null
                    return@map VigilanceAreaSourceModel.fromVigilanceAreaSource(
                        source,
                        controlUnitContactModel,
                        vigilanceAreaModel,
                    )
                }
            } else {
                listOf(
                    VigilanceAreaSourceModel.fromVigilanceAreaSource(
                        source,
                        null,
                        vigilanceAreaModel,
                    ),
                )
            }
        }

    private fun saveTags(
        vigilanceAreaModel: VigilanceAreaModel,
        tags: List<TagEntity>,
    ): List<TagVigilanceAreaModel> {
        vigilanceAreaModel.id?.let {
            dbTagVigilanceAreaRepository.deleteAllByVigilanceAreaId(it)
        }
        val tagModels = fromTagEntities(tags, vigilanceAreaModel)
        tagModels.forEach { vigilanceAreaTag ->
            vigilanceAreaTag.id = TagVigilanceAreaPk(vigilanceAreaTag.tag.id, vigilanceAreaModel.id)
        }
        return dbTagVigilanceAreaRepository.saveAll(tagModels)
    }

    private fun saveThemes(
        vigilanceAreaModel: VigilanceAreaModel,
        themes: List<ThemeEntity>,
    ): List<ThemeVigilanceAreaModel> {
        vigilanceAreaModel.id?.let {
            dbThemeVigilanceAreaRepository.deleteAllByVigilanceAreaId(it)
        }
        val themeModels = fromThemeEntities(themes, vigilanceAreaModel)
        themeModels.forEach { vigilanceAreaTheme ->
            vigilanceAreaTheme.id =
                ThemeVigilanceAreaModel.ThemeVigilanceAreaPk(vigilanceAreaTheme.theme.id, vigilanceAreaModel.id)
        }
        return dbThemeVigilanceAreaRepository.saveAll(themeModels)
    }

    @Transactional
    override fun findAll(): List<VigilanceAreaEntity> =
        dbVigilanceAreaRepository.findAllByIsDeletedFalseOrderByName().map {
            it.toVigilanceAreaEntity()
        }

    @Transactional
    override fun findAllById(ids: List<Int>): List<VigilanceAreaEntity> =
        dbVigilanceAreaRepository.findAllById(ids).map {
            it.toVigilanceAreaEntity()
        }

    override fun findAllIdsByGeometryAndIsDraftIsFalse(geometry: Geometry): List<Int> =
        dbVigilanceAreaRepository.findAllIdsByGeometryAndIsDraftIsFalse(geometry)

    @Transactional
    override fun delete(id: Int) {
        dbVigilanceAreaRepository.delete(id)
    }

    @Transactional
    override fun archiveOutdatedVigilanceAreas(): Int = dbVigilanceAreaRepository.archiveOutdatedVigilanceAreas()

    @Transactional
    override fun findAllTrigrams(): List<String> = dbVigilanceAreaRepository.findAllTrigrams()
}
