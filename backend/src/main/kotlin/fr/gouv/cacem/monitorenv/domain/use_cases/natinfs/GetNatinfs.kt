package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import org.slf4j.LoggerFactory

@UseCase
class GetNatinfs(private val natinfRepository: INatinfRepository) {
    private val logger = LoggerFactory.getLogger(GetNatinfs::class.java)

    fun execute(): List<NatinfEntity> {
        val natinfs = natinfRepository.findAll()
        logger.info("Found ${natinfs.size} natinfs ")

        return natinfs
    }
}
