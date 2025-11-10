package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVesselRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaVesselRepository(
    private val IDBVesselRepository: IDBVesselRepository,
) : IVesselRepository {
    private val logger: Logger = LoggerFactory.getLogger(JpaVesselRepository::class.java)

    override fun findVesselById(id: Int): Vessel? = IDBVesselRepository.findByIdOrNull(id)?.toVessel()

    override fun search(searched: String): List<Vessel> {
        if (searched.isEmpty()) {
            return listOf()
        }

        return IDBVesselRepository
            .searchBy(searched)
            .map { it.toVessel() }
    }
}
