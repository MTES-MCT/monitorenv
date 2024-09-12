package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaImageModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.locationtech.jts.geom.Geometry
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVigilanceAreaRepository(
        private val dbVigilanceAreaRepository: IDBVigilanceAreaRepository,
) : IVigilanceAreaRepository {

    private val logger: Logger = LoggerFactory.getLogger(JpaVigilanceAreaRepository::class.java)

    @Transactional
    override fun findById(id: Int): VigilanceAreaEntity? {
        return dbVigilanceAreaRepository.findByIdOrNull(id)?.toVigilanceAreaEntity()
    }

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun save(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity {
        logger.info("vigilanceAreaEntity: $vigilanceArea")
        val vigilanceAreaModel: VigilanceAreaModel =
                if (vigilanceArea.id === null) {
                    dbVigilanceAreaRepository.save(
                            VigilanceAreaModel.fromVigilanceArea(
                                    vigilanceArea.copy(images = listOf())
                            )
                    )
                } else {
                    VigilanceAreaModel.fromVigilanceArea(vigilanceArea)
                }
        logger.info("vigilanceAreaModel: $vigilanceAreaModel")
        val vigilanceAreaImagesModel =
                vigilanceArea.images?.map {
                    return@map VigilanceAreaImageModel.fromVigilanceAreaImageEntity(
                            it,
                            vigilanceAreaModel
                    )
                }

        vigilanceAreaModel.images.addAll(vigilanceAreaImagesModel ?: emptyList())

        return dbVigilanceAreaRepository.saveAndFlush(vigilanceAreaModel).toVigilanceAreaEntity()
    }

    @Transactional
    override fun findAll(): List<VigilanceAreaEntity> {
        return dbVigilanceAreaRepository.findAll().map { it.toVigilanceAreaEntity() }
    }

    override fun findAllByGeometry(geometry: Geometry): List<VigilanceAreaEntity> {
        val vigilanceAreas = dbVigilanceAreaRepository.findAllByGeom(geometry)
        return vigilanceAreas.map { it.toVigilanceAreaEntity() }
    }

    @Transactional
    override fun delete(id: Int) {
        dbVigilanceAreaRepository.delete(id)
    }

    @Transactional
    override fun archiveOutdatedVigilanceAreas(): Int {
        return dbVigilanceAreaRepository.archiveOutdatedVigilanceAreas()
    }
}
