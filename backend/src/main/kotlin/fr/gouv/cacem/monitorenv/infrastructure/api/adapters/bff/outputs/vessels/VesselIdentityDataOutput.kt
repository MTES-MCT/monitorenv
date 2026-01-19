package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity

data class VesselIdentityDataOutput(
    val category: String?,
    val flag: String?,
    val id: Int,
    val imo: String?,
    val immatriculation: String?,
    val mmsi: String?,
    val shipId: Int?,
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
            )
    }
}
