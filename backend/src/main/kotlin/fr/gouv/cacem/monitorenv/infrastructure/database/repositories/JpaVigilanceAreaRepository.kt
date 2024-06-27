package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVigilanceAreaRepository(
    private val dbVigilanceAreaRepository: IDBVigilanceAreaRepository,
) : IVigilanceAreaRepository {

    @Transactional
    override fun findById(vigilanceAreaId: Int): VigilanceAreaEntity {
        return dbVigilanceAreaRepository.findById(vigilanceAreaId).get().toVigilanceAreaEntity()
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
}