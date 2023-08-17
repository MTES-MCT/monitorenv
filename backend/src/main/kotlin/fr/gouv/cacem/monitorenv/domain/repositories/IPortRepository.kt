package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity

interface IPortRepository {
    fun findById(portId: Int): PortEntity

    fun findAll(): List<PortEntity>

    fun save(portEntity: PortEntity): PortEntity
}
