package fr.gouv.cacem.monitorenv.domain.entities.dashboard

interface DetailWithImagesRenderable : DetailRenderable {
    val image: String?
    val minimap: String?
    val title: String
}
