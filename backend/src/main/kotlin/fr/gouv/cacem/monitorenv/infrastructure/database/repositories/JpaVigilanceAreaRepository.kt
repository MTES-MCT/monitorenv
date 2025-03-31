package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.SubTagVigilanceAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaPk
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaImageModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSubTagVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVigilanceAreaRepository(
    private val dbVigilanceAreaRepository: IDBVigilanceAreaRepository,
    private val dbTagVigilanceAreaRepository: IDBTagVigilanceAreaRepository,
    private val dbSubTagVigilanceAreaRepository: IDBSubTagVigilanceAreaRepository,
) : IVigilanceAreaRepository {
    @Transactional
    override fun findById(id: Int): VigilanceAreaEntity? =
        dbVigilanceAreaRepository.findByIdOrNull(id)?.toVigilanceAreaEntity()

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun save(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity {
        val vigilanceAreaModel: VigilanceAreaModel =
            if (vigilanceArea.id === null) {
                dbVigilanceAreaRepository.save(
                    VigilanceAreaModel.fromVigilanceArea(
                        vigilanceArea.copy(images = listOf()),
                    ),
                )
            } else {
                VigilanceAreaModel.fromVigilanceArea(vigilanceArea)
            }
        val vigilanceAreaImagesModel =
            vigilanceArea.images?.map {
                VigilanceAreaImageModel.fromVigilanceAreaImageEntity(
                    it,
                    vigilanceAreaModel,
                )
            }

        vigilanceAreaModel.images.addAll(vigilanceAreaImagesModel ?: emptyList())

        saveTags(vigilanceAreaModel)
        saveSubTags(vigilanceAreaModel)

        return dbVigilanceAreaRepository.saveAndFlush(vigilanceAreaModel).toVigilanceAreaEntity()
    }

    private fun saveSubTags(vigilanceAreaModel: VigilanceAreaModel) {
        vigilanceAreaModel.id?.let {
            dbSubTagVigilanceAreaRepository.deleteAllByVigilanceAreaId(it)
        }
        vigilanceAreaModel.subTags.forEach { vigilanceAreaSubTag ->
            vigilanceAreaSubTag.id = SubTagVigilanceAreaPk(vigilanceAreaSubTag.subTag.id, vigilanceAreaModel.id)
        }
        dbSubTagVigilanceAreaRepository.saveAllAndFlush(vigilanceAreaModel.subTags)
    }

    private fun saveTags(vigilanceAreaModel: VigilanceAreaModel) {
        vigilanceAreaModel.id?.let {
            dbTagVigilanceAreaRepository.deleteAllByVigilanceAreaId(it)
        }
        vigilanceAreaModel.tags.forEach { vigilanceAreaTag ->
            vigilanceAreaTag.id = TagVigilanceAreaPk(vigilanceAreaTag.tag.id, vigilanceAreaModel.id)
        }
        dbTagVigilanceAreaRepository.saveAllAndFlush(vigilanceAreaModel.tags)
    }

    @Transactional
    override fun findAll(): List<VigilanceAreaEntity> =
        dbVigilanceAreaRepository.findAllByIsDeletedFalseOrderByName().map {
            it.toVigilanceAreaEntity()
        }

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> =
        dbVigilanceAreaRepository.findAllIdsByGeom(geometry)

    @Transactional
    override fun delete(id: Int) {
        dbVigilanceAreaRepository.delete(id)
    }

    @Transactional
    override fun archiveOutdatedVigilanceAreas(): Int = dbVigilanceAreaRepository.archiveOutdatedVigilanceAreas()

    @Transactional
    override fun findAllTrigrams(): List<String> = dbVigilanceAreaRepository.findAllTrigrams()
}
