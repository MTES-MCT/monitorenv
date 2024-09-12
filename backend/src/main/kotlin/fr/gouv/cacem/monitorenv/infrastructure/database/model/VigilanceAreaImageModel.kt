package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "vigilance_area_images")
data class VigilanceAreaImageModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @Lob
    @Column(name = "content", nullable = false, columnDefinition = "bytea")
    val content: ByteArray,

    @Column(name = "mime_type", nullable = false)
    val mimeType: String,

    @Column(name = "image_name", nullable = false)
    val imageName: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_area_id", nullable = false)
    @JsonBackReference
    val vigilanceArea: VigilanceAreaModel,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as VigilanceAreaImageModel

        if (id != other.id) return false
        if (mimeType != other.mimeType) return false
        if (imageName != other.imageName) return false


        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + imageName.hashCode()
        return result
    }

    companion object {
        fun fromVigilanceAreaImageEntity(
            image: ImageEntity,
            vigilanceArea: VigilanceAreaModel,
        ) =
            VigilanceAreaImageModel(
                id = image.id,
                content = image.content,
                imageName = image.imageName,
                mimeType = image.mimeType,
                vigilanceArea = vigilanceArea,

                )
    }

    fun toVigilanceAreaImage() = ImageEntity(
        id = id,
        content = content,
        imageName = imageName,
        mimeType = mimeType,
        vigilanceAreaId = vigilanceArea.id!!,
    )
}
