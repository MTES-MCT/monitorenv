package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity

interface INatinfRepository {
    fun findAll(): List<NatinfEntity>
    fun count(): Long
}
