package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

// Don't forget to mirror any update here in the frontend enum (in both Env and Fish).
enum class ControlUnitResourceType(val label: String) {
    // TODO Complete that with the first types list once it's ready.
    BARGE("Péniche"),
    FRIGATE("Frégate"),
    LAND_VEHICLE("Véhicule terrestre"),
    SCHOOL_BOAT("Bâtiment-École"),
    UNKNOWN("Type inconnu"),
}
