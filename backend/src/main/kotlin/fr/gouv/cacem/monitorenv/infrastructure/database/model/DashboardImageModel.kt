package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import jakarta.persistence.*
import java.io.Serializable
import java.util.*

@Entity
@Table(name = "dashboard_images")
data class DashboardImageModel(
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    @Column(name = "content", nullable = false, columnDefinition = "bytea")
    val content: ByteArray,
    @Column(name = "mime_type", nullable = false)
    val mimeType: String,
    @Column(name = "name", nullable = false)
    val name: String,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dashboard_id", nullable = false)
    @JsonBackReference
    var dashboard: DashboardModel,
    @Column(name = "size", nullable = false)
    val size: Int,
) : Serializable {
    companion object {
        fun fromDashboardImageEntity(
            image: ImageEntity,
            dashboard: DashboardModel,
        ) = DashboardImageModel(
            id = null,
            content = image.content,
            name = image.name,
            mimeType = image.mimeType,
            dashboard = dashboard,
            size = image.size,
        )
    }

    fun toDashboardImage() =
        ImageEntity(
            id = id,
            content = content,
            name = name,
            mimeType = mimeType,
            dashboardId = dashboard.id,
            size = size,
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as DashboardImageModel

        if (size != other.size) return false
        if (id != other.id) return false
        if (!content.contentEquals(other.content)) return false
        if (mimeType != other.mimeType) return false
        if (name != other.name) return false
        if (dashboard != other.dashboard) return false

        return true
    }

    override fun hashCode(): Int {
        var result = size
        result = 31 * result + (id?.hashCode() ?: 0)
        result = 31 * result + content.contentHashCode()
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + dashboard.hashCode()
        return result
    }
}
