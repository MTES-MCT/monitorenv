package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.MissionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.time.ZonedDateTime
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
    fun getMissionsController(
        @Parameter(description = "page number")
        @RequestParam(name = "pageNumber")
        pageNumber: Int?,
        @Parameter(description = "page size")
        @RequestParam(name = "pageSize")
        pageSize: Int?,
        @Parameter(description = "started before date")
        @RequestParam(name = "startedBeforeDateTime", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedBeforeDateTime: ZonedDateTime?,
        @Parameter(description = "started after date")
        @RequestParam(name = "startedAfterDateTime", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedAfterDateTime: ZonedDateTime?
    ): List<MissionDataOutput> {
        var beforeDateTime: Instant = startedBeforeDateTime?.toInstant() ?: ZonedDateTime.now().toInstant()
        var afterDateTime: Instant = startedAfterDateTime?.toInstant() ?: ZonedDateTime.now().minusMonths(1).toInstant()
        if (pageNumber != null && pageSize != null) {
            val missions = getMissions.execute(
                afterDateTime = afterDateTime,
                beforeDateTime = beforeDateTime,
                pageable = PageRequest.of(pageNumber, pageSize)
            )
            return missions.map { MissionDataOutput.fromMission(it) }
        }
        val missions = getMissions.execute(
            afterDateTime = afterDateTime,
            beforeDateTime = beforeDateTime,
            pageable = Pageable.unpaged()
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
