package fr.gouv.cacem.monitorenv.domain.use_cases.port

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IPortRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetPorts(private val portRepository: IPortRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<PortEntity> {
        val ports = portRepository.findAll()

        logger.info("Found ${ports.size} ports.")

        return ports
    }
}
