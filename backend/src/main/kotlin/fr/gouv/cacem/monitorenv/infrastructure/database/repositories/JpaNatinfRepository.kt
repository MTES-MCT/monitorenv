package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNatinfRepository
import org.springframework.stereotype.Repository

@Repository
class JpaNatinfRepository(private val dbNatinfRepository: IDBNatinfRepository) :
    INatinfRepository {
    override fun findAll(): List<NatinfEntity> {
        return dbNatinfRepository.findAll().map { it.toNatinf() }
    }

    override fun count(): Long {
        return dbNatinfRepository.count()
    }
}
