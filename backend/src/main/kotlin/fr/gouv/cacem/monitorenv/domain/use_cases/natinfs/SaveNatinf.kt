package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveNatinf(
    private val natinfRepository: INatinfRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveNatinf::class.java)

    fun execute(natinf: NatinfEntity): NatinfEntity {
        logger.info("Attempt to SAVE natinf from refnatinf ${natinf.refNatinf.id}")
        val savedNatinf = natinfRepository.save(natinf)
        logger.info("Natinf saved")

        return savedNatinf
    }
}
