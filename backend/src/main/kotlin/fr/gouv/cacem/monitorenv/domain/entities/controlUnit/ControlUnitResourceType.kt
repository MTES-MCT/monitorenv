package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

// Don't forget to mirror any update here in both Postgre & Frontend enums, for both Env & Fish.
enum class ControlUnitResourceType(
    val label: String,
) {
    AIRPLANE("Avion"),
    BARGE("Barge"),
    CAR("Voiture"),
    DRONE("Drône"),
    EQUESTRIAN("Équestre"),
    FAST_BOAT("Vedette"),
    FRIGATE("Frégate"),
    HELICOPTER("Hélicoptère"),
    HYDROGRAPHIC_SHIP("Bâtiment hydrographique"),
    KAYAK("Kayak"),
    LIGHT_FAST_BOAT("Vedette légère"),
    MINE_DIVER("Plongeur démineur"),
    MOTORCYCLE("Moto"),
    NET_LIFTER("Remonte-filets"),
    NO_RESOURCE("Aucun moyen"),
    OTHER("Autre"),
    PATROL_BOAT("Patrouilleur"),
    PEDESTRIAN("Piéton"),
    PIROGUE("Pirogue"),
    RIGID_HULL("Coque rigide"),
    SEA_SCOOTER("Scooter de mer"),
    SEMI_RIGID("Semi-rigide"),
    SUPPORT_SHIP("Bâtiment de soutien"),
    TRAINING_SHIP("Bâtiment-école"),
    TUGBOAT("Remorqueur"),
}
