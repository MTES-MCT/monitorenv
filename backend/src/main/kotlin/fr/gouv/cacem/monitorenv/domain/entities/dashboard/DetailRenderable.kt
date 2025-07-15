package fr.gouv.cacem.monitorenv.domain.entities.dashboard

interface DetailRenderable {
    fun buildDetailsRows(): List<List<String>>
}
