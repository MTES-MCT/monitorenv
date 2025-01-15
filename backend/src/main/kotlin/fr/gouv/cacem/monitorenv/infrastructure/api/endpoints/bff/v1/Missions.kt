package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CanDeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMissionWithActionsAndAttachedReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetEngagedControlUnits
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetFullMissionWithFishAndRapportNavActions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetFullMissions
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.LegacyControlUnitAndMissionSourcesDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionsDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime

@RestController("MissionsV1")
@RequestMapping("/bff/v1/missions")
@Tag(description = "API Missions", name = "BFF.Missions")
class Missions(
    private val createOrUpdateMissionWithActionsAndAttachedReporting:
        CreateOrUpdateMissionWithActionsAndAttachedReporting,
    private val getFullMissions: GetFullMissions,
    private val getFullMissionWithFishAndRapportNavActions: GetFullMissionWithFishAndRapportNavActions,
    private val deleteMission: DeleteMission,
    private val getEngagedControlUnits: GetEngagedControlUnits,
    private val canDeleteMission: CanDeleteMission,
) {
    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new mission")
    fun create(
        @RequestBody createMissionDataInput: CreateOrUpdateMissionDataInput,
    ): ResponseEntity<MissionDataOutput> {
        val (fishActionsApiResponds, createdMission) =
            createOrUpdateMissionWithActionsAndAttachedReporting.execute(
                mission = createMissionDataInput.toMissionEntity(),
                attachedReportingIds = createMissionDataInput.attachedReportingIds,
                envActionsAttachedToReportingIds =
                    createMissionDataInput.getEnvActionsAttachedToReportings(),
            )

        val returnCode = if (fishActionsApiResponds) HttpStatus.OK else HttpStatus.PARTIAL_CONTENT

        return ResponseEntity.status(returnCode)
            .body(MissionDataOutput.fromMissionDTO(createdMission))
    }

    @DeleteMapping(value = ["/{missionId}"])
    @Operation(summary = "Delete a mission")
    fun delete(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ) {
        deleteMission.execute(missionId = missionId, source = MissionSourceEnum.MONITORENV)
    }

    @GetMapping("/{missionId}/can_delete")
    @Operation(summary = "Can this mission be deleted?")
    fun canDelete(
        @PathParam("Mission ID")
        @PathVariable(name = "missionId")
        missionId: Int,
        @Parameter(description = "Request source")
        @RequestParam(name = "source")
        source: MissionSourceEnum,
    ): CanDeleteMissionResponse {
        return canDeleteMission.execute(missionId = missionId, source = source)
    }

    @GetMapping("/{missionId}")
    @Operation(summary = "Get mission by Id")
    fun get(
        @PathParam("Mission id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ): ResponseEntity<MissionDataOutput> {
        val (fishActionsApiResponds, mission) =
            getFullMissionWithFishAndRapportNavActions.execute(
                missionId = missionId,
            )

        val returnCode = if (fishActionsApiResponds) HttpStatus.OK else HttpStatus.PARTIAL_CONTENT

        return ResponseEntity.status(returnCode).body(MissionDataOutput.fromMissionDTO(mission))
    }

    @GetMapping("")
    @Operation(summary = "Get missions")
    fun getAll(
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
        @Parameter(description = "Types de mission")
        @RequestParam(name = "missionTypes", required = false)
        missionTypes: List<MissionTypeEnum>?,
        @Parameter(description = "Statuts de mission")
        @RequestParam(name = "missionStatus", required = false)
        missionStatuses: List<String>?,
        @Parameter(description = "Facades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<String>?,
        @RequestParam(name = "searchQuery", required = false)
        searchQuery: String?,
    ): List<MissionsDataOutput> {
        val missions =
            getFullMissions.execute(
                startedAfterDateTime = startedAfterDateTime,
                startedBeforeDateTime = startedBeforeDateTime,
                missionStatuses = missionStatuses,
                missionTypes = missionTypes,
                pageNumber = pageNumber,
                pageSize = pageSize,
                seaFronts = seaFronts,
                searchQuery = searchQuery,
            )
        return missions.map { MissionsDataOutput.fromMissionListDTO(it) }
    }

    // TODO Return a ControlUnitDataOutput once the LegacyControlUnitEntity to ControlUnitEntity
    // migration is done
    @GetMapping("/engaged_control_units")
    @Operation(summary = "Get engaged control units")
    fun getEngagedControlUnits(): List<LegacyControlUnitAndMissionSourcesDataOutput> {
        return getEngagedControlUnits.execute().map {
            LegacyControlUnitAndMissionSourcesDataOutput.fromLegacyControlUnitAndMissionSources(it)
        }
    }

    @PutMapping(value = ["/{missionId}"], consumes = ["application/json"])
    @Operation(summary = "Update a mission")
    fun update(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
        @RequestBody updateMissionDataInput: CreateOrUpdateMissionDataInput,
    ): ResponseEntity<MissionDataOutput> {
        if ((updateMissionDataInput.id != null) && (missionId != updateMissionDataInput.id)) {
            throw java.lang.IllegalArgumentException("missionId doesn't match with request param")
        }
        val (fishActionsApiResponds, mission) =
            createOrUpdateMissionWithActionsAndAttachedReporting.execute(
                mission = updateMissionDataInput.toMissionEntity(),
                attachedReportingIds = updateMissionDataInput.attachedReportingIds,
                envActionsAttachedToReportingIds =
                    updateMissionDataInput.getEnvActionsAttachedToReportings(),
            )

        val returnCode = if (fishActionsApiResponds) HttpStatus.OK else HttpStatus.PARTIAL_CONTENT

        return ResponseEntity.status(returnCode).body(MissionDataOutput.fromMissionDTO(mission))
    }
}
