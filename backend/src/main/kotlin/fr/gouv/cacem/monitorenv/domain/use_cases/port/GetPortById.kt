package fr.gouv.cacem.monitorenv.domain.use_cases.port

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IPortRepository

@UseCase
class GetPortById(private val portRepository: IPortRepository) {
    fun execute(portId: Int): PortEntity {
        return portRepository.findById(portId)
    }
}
