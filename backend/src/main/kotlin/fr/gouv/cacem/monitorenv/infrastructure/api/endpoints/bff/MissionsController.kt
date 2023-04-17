package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.MissionDataOutput
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSeaFrontEnum
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/missions")
@Tag(description = "API Missions", name = "Missions")
class MissionsController(
    private val createMission: CreateMission,
    private val getMonitorEnvMissions: GetMonitorEnvMissions,
    private val getMissionById: GetMissionById,
    private val updateMission: UpdateMission,
    private val deleteMission: DeleteMission
) {

    @GetMapping("")
    @Operation(summary = "Get missions")
    fun getMissionsController(
        @Parameter(description = "page number")
        @RequestParam(name = "pageNumber")
        pageNumber: Int?,
        @Parameter(description = "page size")
        @RequestParam(name = "pageSize")
        pageSize: Int?,
        @Parameter(description = "Mission started after date")
        @RequestParam(name = "startedAfterDateTime", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedAfterDateTime: ZonedDateTime?,
        @Parameter(description = "Mission started before date")
        @RequestParam(name = "startedBeforeDateTime", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedBeforeDateTime: ZonedDateTime?,
        @Parameter(description = "Origine")
        @RequestParam(name = "missionSource", required = false)
        missionSources: List<MissionSourceEnum>?,
        @Parameter(description = "Natures de mission")
        @RequestParam(name = "missionNature", required = false)
        missionNatures: List<String>?,
        @Parameter(description = "Types de mission")
        @RequestParam(name = "missionTypes", required = false)
        missionTypes: List<String>?,
        @Parameter(description = "Statuts de mission")
        @RequestParam(name = "missionStatus", required = false)
        missionStatuses: List<String>?,
        @Parameter(description = "Facades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<MissionSeaFrontEnum>?
    ): List<MissionDataOutput> {
        val missions = getMonitorEnvMissions.execute(
            startedAfterDateTime = startedAfterDateTime,
            startedBeforeDateTime = startedBeforeDateTime,
            missionNatures = missionNatures,
            missionSources = missionSources,
            missionStatuses = missionStatuses,
            missionTypes = missionTypes,
            pageNumber = pageNumber,
            pageSize = pageSize,
            seaFronts = seaFronts
        )
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
        if ((updateMissionDataInput.id != null) && (missionId != updateMissionDataInput.id)) {
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
