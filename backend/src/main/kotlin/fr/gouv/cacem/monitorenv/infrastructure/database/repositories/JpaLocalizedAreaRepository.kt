package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILocalizedAreasRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLocalizedAreaRepository
import org.springframework.stereotype.Repository

@Repository
class JpaLocalizedAreaRepository(
    private val dbLocalizedAreaRepository: IDBLocalizedAreaRepository,
) : ILocalizedAreasRepository {
    override fun findAll(): List<LocalizedAreaEntity> = dbLocalizedAreaRepository.findAll().map { it.toLocalizedArea() }
}
