package fr.gouv.cacem.monitorenv.domain.entities.files

interface IImageEntity {
    val name: String
    val content: ByteArray
    val mimeType: String
    val size: Int
}
