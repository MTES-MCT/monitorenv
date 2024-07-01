package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.PatchMission
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.PatchableMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.MissionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController("PublicApiV2Missions")
@RequestMapping("/api/v2/missions")
@Tag(description = "API Missions", name = "Public.Missions")
class NewMissions(
    private val deleteMission: DeleteMission,
    private val patchMission: PatchMission,
) {
    @DeleteMapping(value = ["/{missionId}"])
    @Operation(summary = "Delete a mission")
    fun delete(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
        @Parameter(description = "Request source")
        @RequestParam(name = "source")
        source: MissionSourceEnum,
    ) {
        deleteMission.execute(missionId = missionId, source = source)
    }

    @PatchMapping(value = ["/{missionId}"])
    @Operation(
        summary = "Patch an existing mission",
        description = "Retrieve the mission with given id and patch it with input data",
    )
    fun patch(
        @PathVariable(name = "missionId")
        id: Int,
        @RequestBody patchableMissionDataInput: PatchableMissionDataInput,
    ): MissionDataOutput {
        return MissionDataOutput.fromMissionDTO(
            patchMission.execute(
                id,
                patchableMissionDataInput.toPatchableMissionEntity(),
            ),
        )
    }
}
