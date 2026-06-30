package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity

data class VesselIdentityDataOutput(
    val id: Int,
    val batchId: Int?,
    val category: String?,
    val flag: String?,
    val imo: String?,
    val immatriculation: String?,
    val mmsi: String?,
    val rowNumber: Int?,
    val shipId: Int,
    val shipName: String?,
) {
    companion object {
        fun fromVessel(vessel: VesselEntity): VesselIdentityDataOutput =
            VesselIdentityDataOutput(
                id = vessel.id,
                shipId = vessel.shipId,
                flag = vessel.flag,
                mmsi = vessel.mmsi,
                imo = vessel.imo,
                immatriculation = vessel.immatriculation,
                shipName = vessel.shipName,
                category = vessel.category,
                batchId = vessel.batchId,
                rowNumber = vessel.rowNumber,
            )
    }
}
