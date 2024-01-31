package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController("PublicApiV2Missions")
@RequestMapping("/api/v2/missions")
@Tag(description = "API Missions", name = "Public.New Missions")
class NewMissions(
    private val deleteMission: DeleteMission,
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
}
