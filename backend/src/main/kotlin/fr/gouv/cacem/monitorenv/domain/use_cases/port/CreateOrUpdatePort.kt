package fr.gouv.cacem.monitorenv.domain.use_cases.port

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IPortRepository

@UseCase
class CreateOrUpdatePort(private val portRepository: IPortRepository) {
    fun execute(portEntity: PortEntity): PortEntity {
        return portRepository.save(portEntity)
    }
}
