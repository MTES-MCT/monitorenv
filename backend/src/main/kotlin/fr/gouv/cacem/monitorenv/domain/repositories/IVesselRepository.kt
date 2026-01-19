package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity

interface IVesselRepository {
    fun findVesselById(id: Int): VesselEntity?

    fun search(searched: String): List<VesselEntity>
}
