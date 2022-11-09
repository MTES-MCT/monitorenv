package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.CreateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissionById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.UpdateMission
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/missions")
@Tag(description = "API Missions", name = "Missions")
class MissionsController(
    private val createMission: CreateMission,
    private val getMissions: GetMissions,
    private val getMissionById: GetMissionById,
    private val updateMission: UpdateMission,
    private val deleteMission: DeleteMission
) {

    @GetMapping("")
    @Operation(summary = "Get missions")
    fun getMissionsController(): List<MissionDataOutput> {
        val missions = getMissions.execute()
        return missions.map { MissionDataOutput.fromMission(it) }
    }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new mission")
    fun createMissionController(
        @RequestBody
        createMissionDataInput: CreateOrUpdateMissionDataInput
    ): MissionDataOutput {
        val newMission = createMissionDataInput.toMissionEntity()
        val createdMission = createMission.execute(mission = newMission)
        return MissionDataOutput.fromMission(createdMission)
    }

    @GetMapping("/{missionId}")
    @Operation(summary = "Get mission by Id")
    fun getMissionByIdController(
        @PathParam("Mission id")
        @PathVariable(name = "missionId")
        missionId: Int
    ): MissionDataOutput {
        val mission = getMissionById.execute(missionId = missionId)

        return MissionDataOutput.fromMission(mission)
    }

    @PutMapping(value = ["/{missionId}"], consumes = ["application/json"])
    @Operation(summary = "Update a mission")
    fun updateOperationController(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
        @RequestBody
        updateMissionDataInput: CreateOrUpdateMissionDataInput
    ): MissionDataOutput {
        // FIXME: à déplacer dans le execute
        if (missionId !== updateMissionDataInput.id) {
            throw java.lang.IllegalArgumentException("missionId doesn't match with request param")
        }
        return updateMission.execute(
            mission = updateMissionDataInput.toMissionEntity()
        ).let {
            MissionDataOutput.fromMission(it)
        }
    }

    @DeleteMapping(value = ["/{missionId}"])
    @Operation(summary = "Delete a mission")
    fun deleteOperationController(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int
    ) {
        deleteMission.execute(missionId = missionId)
    }
}
