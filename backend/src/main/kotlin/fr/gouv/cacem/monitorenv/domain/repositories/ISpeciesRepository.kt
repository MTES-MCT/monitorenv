package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.species.SpecyEntity

interface ISpeciesRepository {
    fun findAll(): List<SpecyEntity>
}
