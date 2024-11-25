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
    @Column(name = "content", nullable = false, columnDefinition = "bytea")
    val content: ByteArray,
    @Column(name = "mime_type", nullable = false)
    val mimeType: String,
    @Column(name = "name", nullable = false)
    val name: String,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_area_id", nullable = false)
    @JsonBackReference
    val vigilanceArea: VigilanceAreaModel,
    @Column(name = "size", nullable = false)
    val size: Int,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as VigilanceAreaImageModel

        if (id != other.id) return false
        if (mimeType != other.mimeType) return false
        if (name != other.name) return false
        if (size != other.size) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + size
        return result
    }

    companion object {
        fun fromVigilanceAreaImageEntity(
            image: ImageEntity,
            vigilanceArea: VigilanceAreaModel,
        ) = VigilanceAreaImageModel(
            id = image.id,
            content = image.content,
            name = image.name,
            mimeType = image.mimeType,
            vigilanceArea = vigilanceArea,
            size = image.size,
        )
    }

    fun toVigilanceAreaImage() =
        ImageEntity(
            id = id,
            content = content,
            name = name,
            mimeType = mimeType,
            vigilanceAreaId = vigilanceArea.id!!,
            size = size,
        )
}
