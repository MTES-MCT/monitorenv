package fr.gouv.cacem.monitorenv.domain.use_cases.species

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.species.SpecyEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISpeciesRepository
import org.slf4j.LoggerFactory

@UseCase
class GetSpecies(
    val speciesRepository: ISpeciesRepository,
) {
    private val logger = LoggerFactory.getLogger(GetSpecies::class.java)

    fun execute(): List<SpecyEntity> {
        logger.info("Attempt to GET all species")
        val species = speciesRepository.findAll()
        logger.info("Found ${species.size} ")

        return species
    }
}
