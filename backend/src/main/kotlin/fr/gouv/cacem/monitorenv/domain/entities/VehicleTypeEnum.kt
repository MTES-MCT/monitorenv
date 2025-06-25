package fr.gouv.cacem.monitorenv.domain.entities

enum class VehicleTypeEnum {
    VESSEL,
    OTHER_SEA,
    VEHICLE_LAND,
    VEHICLE_AIR,
    ;

    companion object {
        fun translateVehicleType(vehicleType: VehicleTypeEnum?): String =
            when (vehicleType) {
                VEHICLE_AIR -> "Véhicule aérien"
                VEHICLE_LAND -> "Véhicule terrestre"
                VESSEL -> "Navire"
                else -> "Autre véhicule"
            }
    }
}
