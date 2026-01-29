package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity

interface IRefNatinfRepository {
    fun findAll(): List<RefNatinfEntity>
}
