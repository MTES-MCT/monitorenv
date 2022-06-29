package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.CreateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissionById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.UpdateMission
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.*

import io.micrometer.core.instrument.MeterRegistry
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
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
  private val objectMapper: ObjectMapper,
  meterRegistry: MeterRegistry
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
  @Operation(summary = "Update an mission")
  fun updateOperationController(
    @PathParam("Mission Id")
    @PathVariable(name = "missionId")
    missionId: Int,
    @RequestBody
    updateMissionDataInput: CreateOrUpdateMissionDataInput
  ): MissionDataOutput {
    return updateMission.execute(
      mission = updateMissionDataInput.toMissionEntity()
    ).let {
      MissionDataOutput.fromMission(it)
    }
  }
}
