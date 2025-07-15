package fr.gouv.cacem.monitorenv.domain.entities.dashboard

interface DetailWithImagesRenderable :
    DetailRenderable,
    CustomizableCell {
    val image: String?
    val minimap: String?
    val title: String
}
