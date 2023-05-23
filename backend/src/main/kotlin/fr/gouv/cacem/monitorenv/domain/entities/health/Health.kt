package fr.gouv.cacem.monitorenv.domain.entities.health

data class Health(
    val numberOfRegulatoryAreas: Long,
    val numberOfMissions: Long,
    val numberOfNatinfs: Long,
    val numberOfSemaphores: Long
)
