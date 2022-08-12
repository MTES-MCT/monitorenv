package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity

interface INatinfRepository {
  fun findNatinfs(): List<NatinfEntity>
}

