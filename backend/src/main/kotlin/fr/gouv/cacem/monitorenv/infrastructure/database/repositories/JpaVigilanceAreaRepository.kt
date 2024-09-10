package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.locationtech.jts.geom.Geometry
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
    override fun save(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity {
        val vigilanceAreaModel = VigilanceAreaModel.fromVigilanceArea(vigilanceArea)
        return dbVigilanceAreaRepository.save(vigilanceAreaModel).toVigilanceAreaEntity()
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
