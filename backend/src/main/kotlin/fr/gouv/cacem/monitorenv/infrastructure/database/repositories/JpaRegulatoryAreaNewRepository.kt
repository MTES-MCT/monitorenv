package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaNewRepository
import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaNewRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaNewRepository,
) : IRegulatoryAreaNewRepository {
    override fun findAll(): List<RegulatoryAreaNewEntity> =
        dbRegulatoryAreaRepository.findAll().map { it.toRegulatoryArea() }
}
