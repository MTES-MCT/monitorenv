package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.infractions.InfractionEntity

interface IInfractionRepository {
  fun findInfractions(): List<InfractionEntity>
}

