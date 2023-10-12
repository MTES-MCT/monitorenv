package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.FullMissionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.MissionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime

@RestController
@RequestMapping("/bff/v1/missions")
@Tag(description = "API Missions", name = "Missions")
class MissionsController(
    private val createOrUpdateMission: CreateOrUpdateMission,
    private val getMonitorEnvMissions: GetMonitorEnvMissions,
    private val getMissionById: GetMissionById,
    private val deleteMission: DeleteMission,
    private val getEngagedControlUnits: GetEngagedControlUnits,
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
        @Parameter(description = "Types de mission")
        @RequestParam(name = "missionTypes", required = false)
        missionTypes: List<String>?,
        @Parameter(description = "Statuts de mission")
        @RequestParam(name = "missionStatus", required = false)
        missionStatuses: List<String>?,
        @Parameter(description = "Facades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<String>?,
    ): List<FullMissionDataOutput> {
        val missions = getMonitorEnvMissions.execute(
            startedAfterDateTime = startedAfterDateTime,
            startedBeforeDateTime = startedBeforeDateTime,
            missionSources = missionSources,
            missionStatuses = missionStatuses,
            missionTypes = missionTypes,
            pageNumber = pageNumber,
            pageSize = pageSize,
            seaFronts = seaFronts,
        )
        return missions.map { FullMissionDataOutput.fromFullMissionDTO(it) }
    }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new mission")
    fun createMissionController(
        @RequestBody
        createMissionDataInput: CreateOrUpdateMissionDataInput,
    ): FullMissionDataOutput {
        val newMission = createMissionDataInput.toMissionEntity()
        val createdMission = createOrUpdateMission.execute(mission = newMission)
        return FullMissionDataOutput.fromFullMissionDTO(createdMission)
    }

    @GetMapping("/{missionId}")
    @Operation(summary = "Get mission by Id")
    fun getMissionByIdController(
        @PathParam("Mission id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ): FullMissionDataOutput {
        val mission = getMissionById.execute(missionId = missionId)

        return FullMissionDataOutput.fromFullMissionDTO(mission)
    }

    @PutMapping(value = ["/{missionId}"], consumes = ["application/json"])
    @Operation(summary = "Update a mission")
    fun updateOperationController(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
        @RequestBody
        updateMissionDataInput: CreateOrUpdateMissionDataInput,
    ): FullMissionDataOutput {
        if ((updateMissionDataInput.id != null) && (missionId != updateMissionDataInput.id)) {
            throw java.lang.IllegalArgumentException("missionId doesn't match with request param")
        }
        return createOrUpdateMission.execute(
            mission = updateMissionDataInput.toMissionEntity(),
        ).let {
            FullMissionDataOutput.fromFullMissionDTO(it)
        }
    }

    @DeleteMapping(value = ["/{missionId}"])
    @Operation(summary = "Delete a mission")
    fun deleteOperationController(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ) {
        deleteMission.execute(missionId = missionId)
    }

    // TODO Return a ControlUnitDataOutput once the LegacyControlUnitEntity to ControlUnitEntity migration is done
    @GetMapping("/engaged_control_units")
    @Operation(summary = "Get engaged control units")
    fun getEngagedControlUnitsController(): List<LegacyControlUnitEntity> {
        return getEngagedControlUnits.execute()
    }
}
