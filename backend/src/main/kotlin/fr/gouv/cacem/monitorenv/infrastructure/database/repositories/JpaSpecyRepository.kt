package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.species.SpecyEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISpeciesRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSpecyRepository
import org.springframework.stereotype.Repository

@Repository
class JpaSpecyRepository(
    private val dbSpecyRepository: IDBSpecyRepository,
) : ISpeciesRepository {
    override fun findAll(): List<SpecyEntity> = dbSpecyRepository.findAll().map { it.toSpecyEntity() }
}
