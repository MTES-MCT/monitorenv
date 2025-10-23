package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel

interface IVesselRepository {
    fun findVesselById(id: Int): Vessel?

    fun search(searched: String): List<Vessel>
}
