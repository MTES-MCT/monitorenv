package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRefNatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRefNatinfRepository
import org.springframework.stereotype.Repository

@Repository
class JpaRefNatinfRepository(
    private val dbRefNatinfRepository: IDBRefNatinfRepository,
) : IRefNatinfRepository {
    override fun findAll(): List<RefNatinfEntity> = dbRefNatinfRepository.findAll().map { it.toRefNatinfEntity() }
}
