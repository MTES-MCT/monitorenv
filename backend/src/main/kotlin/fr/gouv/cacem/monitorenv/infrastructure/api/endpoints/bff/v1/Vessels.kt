package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.GetVesselById
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.SearchVessels
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels.VesselDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels.VesselIdentityDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/vessels")
@Tag(name = "APIs for Vessels")
class Vessels(
    private val getVesselById: GetVesselById,
    private val searchVessels: SearchVessels,
) {
    @GetMapping("/{id}")
    @Operation(summary = "Get a vessel by its ID")
    fun getVesselById(
        @PathParam("Vessel ID")
        @PathVariable(name = "id")
        id: Int,
    ): VesselDataOutput = VesselDataOutput.fromVessel(getVesselById.execute(id))

    @GetMapping("/search")
    @Operation(summary = "Search vessels")
    fun searchVessel(
        @Parameter(
            description = "ship name, MMSI, IMO or immatriculation ",
            required = true,
        )
        @RequestParam(name = "searched")
        searched: String,
    ): List<VesselIdentityDataOutput> =
        searchVessels.execute(searched).map {
            VesselIdentityDataOutput.fromVessel(it)
        }
}
