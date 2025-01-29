package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaImageModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVigilanceAreaRepository(
    private val dbVigilanceAreaRepository: IDBVigilanceAreaRepository,
) : IVigilanceAreaRepository {
    @Transactional
    override fun findById(id: Int): VigilanceAreaEntity? {
        return dbVigilanceAreaRepository.findByIdOrNull(id)?.toVigilanceAreaEntity()
    }

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
                return@map VigilanceAreaImageModel.fromVigilanceAreaImageEntity(
                    it,
                    vigilanceAreaModel,
                )
            }

        vigilanceAreaModel.images.addAll(vigilanceAreaImagesModel ?: emptyList())

        return dbVigilanceAreaRepository.saveAndFlush(vigilanceAreaModel).toVigilanceAreaEntity()
    }

    @Transactional
    override fun findAll(): List<VigilanceAreaEntity> {
        return dbVigilanceAreaRepository.findAllByIsDeletedFalseOrderByName().map { it.toVigilanceAreaEntity() }
    }

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> {
        return dbVigilanceAreaRepository.findAllIdsByGeom(geometry)
    }

    @Transactional
    override fun delete(id: Int) {
        dbVigilanceAreaRepository.delete(id)
    }

    @Transactional
    override fun archiveOutdatedVigilanceAreas(): Int {
        return dbVigilanceAreaRepository.archiveOutdatedVigilanceAreas()
    }

    @Transactional
    override fun findAllTrigrams(): List<String> {
        return dbVigilanceAreaRepository.findAllTrigrams()
    }
}
