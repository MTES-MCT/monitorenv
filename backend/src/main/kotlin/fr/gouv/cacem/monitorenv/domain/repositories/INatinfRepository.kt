package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.NatinfEntity

interface INatinfRepository {
    fun findAll(): List<NatinfEntity>

    fun count(): Long

    fun save(
        natinf: fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity,
    ): fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
}
