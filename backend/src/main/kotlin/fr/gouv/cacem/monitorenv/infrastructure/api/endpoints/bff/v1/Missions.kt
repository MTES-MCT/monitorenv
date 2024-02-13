package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.LegacyControlUnitAndMissionSourcesDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionsDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BooleanDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime

@RestController("MissionsV1")
@RequestMapping("/bff/v1/missions")
@Tag(description = "API Missions", name = "BFF.Missions")
class Missions(
    private val createOrUpdateMissionWithActionsAndAttachedReporting:
        CreateOrUpdateMissionWithActionsAndAttachedReporting,
    private val getFullMissions: GetFullMissions,
    private val getFullMissionById: GetFullMissionById,
    private val deleteMission: DeleteMission,
    private val getEngagedControlUnits: GetEngagedControlUnits,
    private val canDeleteMission: CanDeleteMission,

) {
    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new mission")
    fun create(
        @RequestBody
        createMissionDataInput: CreateOrUpdateMissionDataInput,
    ): MissionDataOutput {
        val createdMission =
            createOrUpdateMissionWithActionsAndAttachedReporting.execute(
                mission = createMissionDataInput.toMissionEntity(),
                attachedReportingIds = createMissionDataInput.attachedReportingIds,
                envActionsAttachedToReportingIds =
                createMissionDataInput.getEnvActionsAttachedToReportings(),
            )
        return MissionDataOutput.fromMissionDTO(createdMission)
    }

    @DeleteMapping(value = ["/{missionId}"])
    @Operation(summary = "Delete a mission")
    fun delete(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ) {
        deleteMission.execute(missionId = missionId)
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
    ): BooleanDataOutput {
        return canDeleteMission.execute(missionId = missionId, source = source).let { BooleanDataOutput.get(it) }
    }

    @GetMapping("/{missionId}")
    @Operation(summary = "Get mission by Id")
    fun get(
        @PathParam("Mission id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ): MissionDataOutput {
        val mission = getFullMissionById.execute(missionId = missionId)

        return MissionDataOutput.fromMissionDTO(mission)
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
        @Parameter(description = "Origine")
        @RequestParam(name = "missionSource", required = false)
        missionSources: List<MissionSourceEnum>?,
        @Parameter(description = "Types de mission")
        @RequestParam(name = "missionTypes", required = false)
        missionTypes: List<MissionTypeEnum>?,
        @Parameter(description = "Statuts de mission")
        @RequestParam(name = "missionStatus", required = false)
        missionStatuses: List<String>?,
        @Parameter(description = "Facades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<String>?,
    ): List<MissionsDataOutput> {
        val missions =
            getFullMissions.execute(
                startedAfterDateTime = startedAfterDateTime,
                startedBeforeDateTime = startedBeforeDateTime,
                missionSources = missionSources,
                missionStatuses = missionStatuses,
                missionTypes = missionTypes,
                pageNumber = pageNumber,
                pageSize = pageSize,
                seaFronts = seaFronts,
            )
        return missions.map { MissionsDataOutput.fromMissionDTO(it) }
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
    ): MissionDataOutput {
        if ((updateMissionDataInput.id != null) && (missionId != updateMissionDataInput.id)) {
            throw java.lang.IllegalArgumentException("missionId doesn't match with request param")
        }
        return createOrUpdateMissionWithActionsAndAttachedReporting.execute(
            mission = updateMissionDataInput.toMissionEntity(),
            attachedReportingIds = updateMissionDataInput.attachedReportingIds,
            envActionsAttachedToReportingIds =
            updateMissionDataInput.getEnvActionsAttachedToReportings(),
        )
            .let { MissionDataOutput.fromMissionDTO(it) }
    }
}
