package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository

@UseCase
class SearchVessels(
    private val vesselRepository: IVesselRepository,
) {
    fun execute(searched: String): List<VesselEntity> = vesselRepository.search(searched)
}
