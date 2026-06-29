package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "vessels_additional_information")
data class VesselAdditionalInformationModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,
    val batchId: Int?,
    val observations: String?,
    val shipId: Int,
    val rowNumber: Int?,
) {
    companion object {
        fun fromVesselAdditionalInformation(
            vesselId: VesselIdEntity,
            vesselAdditionalInformation: VesselAdditionalInformationEntity,
        ): VesselAdditionalInformationModel =
            VesselAdditionalInformationModel(
                id = vesselAdditionalInformation.id,
                batchId = vesselId.batchId,
                rowNumber = vesselId.rowNumber,
                shipId = vesselId.shipId,
                observations = vesselAdditionalInformation.observations,
            )
    }

    fun toVesselAdditionalInformation(): VesselAdditionalInformationEntity =
        VesselAdditionalInformationEntity(
            id = id,
            observations = observations,
        )
}
