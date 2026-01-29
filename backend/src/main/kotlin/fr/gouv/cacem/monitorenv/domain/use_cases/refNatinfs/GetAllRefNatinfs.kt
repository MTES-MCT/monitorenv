package fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRefNatinfRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRefNatinfs(
    private val refINatinfRepository: IRefNatinfRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRefNatinfs::class.java)

    fun execute(): List<RefNatinfEntity> {
        logger.info("Attempt to GET all referential natinfs")
        val refNatinfs = refINatinfRepository.findAll()
        logger.info("Found ${refNatinfs.size} referential natinfs")

        return refNatinfs
    }
}
