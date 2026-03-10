@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import org.slf4j.LoggerFactory

@UseCase
class GetNatinfsByThemes(
    private val natinfRepository: INatinfRepository,
) {
    private val logger = LoggerFactory.getLogger(GetNatinfsByThemes::class.java)

    fun execute(ids: List<Int>): List<NatinfEntity> {
        logger.info("Attempt to GET all natinfs from themes ids = $ids")
        val natinfs = natinfRepository.findAllByThemesIds(ids)
        logger.info("Found ${natinfs.size} natinfs from themes ids = $ids")

        return natinfs
    }
}
