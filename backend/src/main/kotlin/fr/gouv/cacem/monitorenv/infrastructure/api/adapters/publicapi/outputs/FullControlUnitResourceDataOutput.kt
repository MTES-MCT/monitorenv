package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

data class FullControlUnitResourceDataOutput(
    val id: Int,
    val controlUnit: ControlUnitDataOutput,
    val controlUnitId: Int,
    val isArchived: Boolean,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val station: StationDataOutput,
    val stationId: Int,
    val type: ControlUnitResourceType,
) {
    companion object {
        fun fromFullControlUnitResource(
            fullControlUnitResource: FullControlUnitResourceDTO,
        ): FullControlUnitResourceDataOutput {
            val station = StationDataOutput.fromStation(fullControlUnitResource.station)
            val controlUnit = ControlUnitDataOutput.fromControlUnit(fullControlUnitResource.controlUnit)

            return FullControlUnitResourceDataOutput(
                id = requireNotNull(fullControlUnitResource.controlUnitResource.id),
                controlUnit,
                controlUnitId = fullControlUnitResource.controlUnitResource.controlUnitId,
                isArchived = fullControlUnitResource.controlUnitResource.isArchived,
                name = fullControlUnitResource.controlUnitResource.name,
                note = fullControlUnitResource.controlUnitResource.note,
                photo = fullControlUnitResource.controlUnitResource.photo,
                station,
                stationId = station.id,
                type = fullControlUnitResource.controlUnitResource.type,
            )
        }
    }
}
