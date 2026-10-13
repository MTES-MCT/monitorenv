package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.files.ImageEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "reportings_images")
class ReportingImageModel(
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
    @JoinColumn(name = "reporting_id", nullable = false)
    val reporting: ReportingModel,
    @Column(name = "size", nullable = false)
    val size: Int,
) : Serializable {
    companion object {
        fun fromImageEntity(
            reportingModel: ReportingModel,
            image: ImageEntity,
        ): ReportingImageModel =
            ReportingImageModel(
                id = null,
                content = image.content,
                name = image.name,
                mimeType = image.mimeType,
                size = image.size,
                reporting = reportingModel,
            )
    }

    fun toImageEntity(): ImageEntity =
        ImageEntity(
            id = id,
            content = content,
            name = name,
            mimeType = mimeType,
            size = size,
        )
}
