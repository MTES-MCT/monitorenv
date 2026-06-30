package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "vessels_files")
class VesselFileModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    val batchId: Int?,
    @Column(name = "content", nullable = false, columnDefinition = "bytea")
    val content: ByteArray,
    @Column(name = "mime_type", nullable = false)
    val mimeType: String,
    @Column(name = "name", nullable = false)
    val name: String,
    val shipId: Int,
    val rowNumber: Int?,
    @Column(name = "size", nullable = false)
    val size: Int,
) : Serializable {
    companion object {
        fun fromVesselFileEntity(
            vesselId: VesselIdEntity,
            vesselFile: VesselFileEntity,
        ): VesselFileModel =
            VesselFileModel(
                id = null,
                batchId = vesselId.batchId,
                content = vesselFile.content,
                name = vesselFile.name,
                mimeType = vesselFile.mimeType,
                rowNumber = vesselId.rowNumber,
                size = vesselFile.size,
                shipId = vesselId.shipId,
            )
    }

    fun toVesselFile(): VesselFileEntity =
        VesselFileEntity(
            id = id,
            content = content,
            name = name,
            mimeType = mimeType,
            size = size,
        )
}
