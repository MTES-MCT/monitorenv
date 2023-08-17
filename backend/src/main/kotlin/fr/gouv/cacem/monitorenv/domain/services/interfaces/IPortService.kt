package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity

interface IPortService {
    fun getById(portId: Int): PortEntity
}
