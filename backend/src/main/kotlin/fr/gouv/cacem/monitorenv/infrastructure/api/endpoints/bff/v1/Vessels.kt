package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.GetVesselByShipId
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SaveVesselAdditionalInformation
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SaveVesselFiles
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SearchVessels
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vessel.VesselAdditionalInformationDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vessel.VesselFileDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels.VesselAdditionalInformationDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels.VesselDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels.VesselFileDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels.VesselIdentityDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/vessels")
@Tag(name = "APIs for Vessels")
class Vessels(
    private val getVesselByShipId: GetVesselByShipId,
    private val searchVessels: SearchVessels,
    private val saveVesselAdditionalInformation: SaveVesselAdditionalInformation,
    private val saveVesselFiles: SaveVesselFiles,
) {
    @GetMapping("/{id}")
    @Operation(summary = "Get a vessel by its ID")
    fun getVesselById(
        @PathParam("Vessel ID")
        @PathVariable(name = "id")
        id: Int,
        @Parameter(
            description = "batchId",
            required = false,
        )
        @RequestParam(name = "batchId")
        batchId: Int?,
        @Parameter(
            description = "rowNumber",
            required = false,
        )
        @RequestParam(name = "rowNumber")
        rowNumber: Int?,
    ): VesselDataOutput =
        VesselDataOutput.fromVessel(
            getVesselByShipId.execute(
                VesselIdEntity(
                    batchId = batchId,
                    rowNumber = rowNumber,
                    shipId = id,
                ),
            ),
        )

    @GetMapping("/search")
    @Operation(summary = "Search vessels")
    fun searchVessel(
        @Parameter(
            description = "ship name, MMSI, IMO or immatriculation ",
            required = true,
        )
        @RequestParam(name = "searched")
        searched: String,
    ): List<VesselIdentityDataOutput> = searchVessels.execute(searched).map { VesselIdentityDataOutput.fromVessel(it) }

    @PutMapping(value = ["/additional_information"], consumes = ["application/json"])
    @Operation(summary = "Create or update a vessel additional information")
    fun saveAdditionalInformation(
        @RequestParam(name = "shipId")
        shipId: Int,
        @Parameter(
            description = "batchId",
            required = false,
        )
        @RequestParam(name = "batchId")
        batchId: Int?,
        @Parameter(
            description = "rowNumber",
            required = false,
        )
        @RequestParam(name = "rowNumber")
        rowNumber: Int?,
        @RequestBody vesselAdditionalInformationInput: VesselAdditionalInformationDataInput,
    ): VesselAdditionalInformationDataOutput =
        VesselAdditionalInformationDataOutput.fromVesselAdditionalInformation(
            saveVesselAdditionalInformation.execute(
                vesselId = VesselIdEntity(batchId = batchId, rowNumber = rowNumber, shipId = shipId),
                vesselAdditionalInformation = vesselAdditionalInformationInput.toVesselAdditionalInformation(),
            ),
        )

    @PutMapping(value = ["/files"], consumes = ["application/json"])
    @Operation(summary = "Create or update vessel files")
    fun saveFiles(
        @RequestParam(name = "shipId")
        shipId: Int,
        @Parameter(
            description = "batchId",
            required = false,
        )
        @RequestParam(name = "batchId")
        batchId: Int?,
        @Parameter(
            description = "rowNumber",
            required = false,
        )
        @RequestParam(name = "rowNumber")
        rowNumber: Int?,
        @RequestBody vesselFileDataInputs: List<VesselFileDataInput>,
    ): List<VesselFileDataOutput> {
        val savedFiles =
            saveVesselFiles.execute(
                vesselId = VesselIdEntity(batchId = batchId, rowNumber = rowNumber, shipId = shipId),
                vesselFiles = vesselFileDataInputs.map { it.toVesselFile() },
            )
        return savedFiles.map { VesselFileDataOutput.fromVesselFile(it) }
    }
}
