package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel

data class VesselIdentityDataOutput(
    val id: Int,
    val flag: String?,
    val mmsi: String?,
    val imo: String?,
    val immatriculation: String?,
    val shipName: String?,
) {
    companion object {
        fun fromVessel(vessel: Vessel): VesselIdentityDataOutput =
            VesselIdentityDataOutput(
                id = vessel.id,
                flag = vessel.flag,
                mmsi = vessel.mmsi,
                imo = vessel.imo,
                immatriculation = vessel.immatriculation,
                shipName = vessel.shipName,
            )
    }
}
