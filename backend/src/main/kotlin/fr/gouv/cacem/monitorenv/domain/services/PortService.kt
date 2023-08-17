package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IPortRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IPortService
import org.springframework.stereotype.Service

@Service
class PortService(private val portRepository: IPortRepository) : IPortService {
    override fun getById(portId: Int): PortEntity {
        return portRepository.findById(portId)
    }
}
