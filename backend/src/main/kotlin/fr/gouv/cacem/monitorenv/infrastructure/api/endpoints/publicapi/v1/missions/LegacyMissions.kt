package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.BypassActionCheckAndDeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CanDeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetEngagedControlUnits
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissionWithRapportNavActions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissionsByIds
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.LegacyControlUnitAndMissionSourcesDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.MissionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.MissionWithRapportNavActionsDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.time.ZonedDateTime

@RestController("PublicApiV1Missions")
@RequestMapping("/api/v1/missions")
@Tag(description = "API Missions", name = "Public.Missions")
class LegacyMissions(
    private val createOrUpdateMission: CreateOrUpdateMission,
    private val getMissionWithRapportNavActions: GetMissionWithRapportNavActions,
    private val bypassActionCheckAndDeleteMission: BypassActionCheckAndDeleteMission,
    private val getEngagedControlUnits: GetEngagedControlUnits,
    private val getMissionsByIds: GetMissionsByIds,
    private val sseMission: SSEMission,
    private val canDeleteMission: CanDeleteMission,
    private val getMissions: GetMissions,
) {
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
        @Parameter(description = "Statut de mission")
        @RequestParam(name = "missionStatus", required = false)
        missionStatuses: List<String>?,
        @Parameter(description = "Facades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<String>?,
        @Parameter(description = "Unités de contrôle")
        @RequestParam(name = "controlUnits", required = false)
        controlUnitIds: List<Int>? = null,
        @RequestParam(name = "searchQuery", required = false)
        searchQuery: String?,
    ): List<MissionDataOutput> {
        val missions =
            getMissions.execute(
                startedAfterDateTime = startedAfterDateTime,
                startedBeforeDateTime = startedBeforeDateTime,
                missionSources = missionSources,
                missionStatuses = missionStatuses,
                missionTypes = missionTypes,
                seaFronts = seaFronts,
                controlUnitIds = controlUnitIds,
                pageNumber = pageNumber,
                pageSize = pageSize,
                searchQuery = searchQuery,
                withLegacyControlPlans = true,
            )
        return missions.map { MissionDataOutput.fromMissionEntity(it) }
    }

    @GetMapping("/find")
    @Operation(summary = "Get missions of specified identifiers")
    fun getMissionsOfIds(
        @Parameter(description = "Requested identifiers")
        @RequestParam(name = "ids")
        ids: List<Int>,
    ): List<MissionDataOutput> {
        val missions = getMissionsByIds.execute(ids)
        return missions.map { MissionDataOutput.fromMissionEntity(it) }
    }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new mission")
    fun create(
        @RequestBody
        createMissionDataInput: CreateOrUpdateMissionDataInput,
    ): MissionDataOutput {
        val newMission = createMissionDataInput.toMissionEntity()
        val createdMission = createOrUpdateMission.execute(mission = newMission)
        return MissionDataOutput.fromMissionEntity(createdMission)
    }

    @GetMapping("/{missionId}")
    @Operation(summary = "Get mission with rapportNav actions by Id")
    fun get(
        @PathParam("Mission id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ): MissionWithRapportNavActionsDataOutput {
        val mission = getMissionWithRapportNavActions.execute(missionId = missionId)

        return MissionWithRapportNavActionsDataOutput.fromMissionDTO(mission)
    }

    @PostMapping(value = ["/{missionId}"], consumes = ["application/json"])
    @Operation(summary = "Update a mission")
    fun update(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
        @RequestBody updateMissionDataInput: CreateOrUpdateMissionDataInput,
    ): MissionDataOutput {
        if ((updateMissionDataInput.id == null) || (missionId != updateMissionDataInput.id)) {
            throw java.lang.IllegalArgumentException("missionId doesn't match with request param")
        }
        return createOrUpdateMission
            .execute(
                mission = updateMissionDataInput.toMissionEntity(),
            ).let { MissionDataOutput.fromMissionEntity(it) }
    }

    @DeleteMapping(value = ["/{missionId}"])
    @Operation(summary = "Delete a mission")
    fun delete(
        @PathParam("Mission Id")
        @PathVariable(name = "missionId")
        missionId: Int,
    ) {
        bypassActionCheckAndDeleteMission.execute(missionId = missionId)
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
    ): CanDeleteMissionResponse = canDeleteMission.execute(missionId = missionId, source = source)

    // TODO Return a ControlUnitDataOutput once the LegacyControlUnitEntity to ControlUnitEntity
    // migration is done
    @GetMapping("/engaged_control_units")
    @Operation(summary = "Get engaged control units")
    fun getEngagedControlUnits(): List<LegacyControlUnitAndMissionSourcesDataOutput> =
        getEngagedControlUnits
            .execute()
            .map { LegacyControlUnitAndMissionSourcesDataOutput.fromLegacyControlUnitAndMissionSources(it) }

    /**
     * This method creates the connexion to the frontend (with EventSource)
     */
    @GetMapping(value = ["/sse"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun createMissionSSE(): SseEmitter = sseMission.registerListener()
}
