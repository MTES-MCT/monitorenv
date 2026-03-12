package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity

interface IVesselRepository {
    fun findVesselByShipId(
        shipId: Int,
        batchId: Int?,
        rowNumber: Int?,
    ): VesselEntity?

    fun search(searched: String): List<VesselEntity>
}
