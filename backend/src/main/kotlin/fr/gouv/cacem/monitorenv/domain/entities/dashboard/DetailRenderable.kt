package fr.gouv.cacem.monitorenv.domain.entities.dashboard

fun interface DetailRenderable {
    fun buildDetailsRows(): List<List<String>>
}
