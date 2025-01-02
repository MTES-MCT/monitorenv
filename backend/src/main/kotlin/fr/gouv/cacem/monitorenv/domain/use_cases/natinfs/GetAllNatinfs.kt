@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllNatinfs(private val natinfRepository: INatinfRepository) {
    private val logger = LoggerFactory.getLogger(GetAllNatinfs::class.java)

    fun execute(): List<NatinfEntity> {
        logger.info("Attempt to GET all natinfs")
        val natinfs = natinfRepository.findAll()
        logger.info("Found ${natinfs.size} natinfs")

        return natinfs
    }
}
