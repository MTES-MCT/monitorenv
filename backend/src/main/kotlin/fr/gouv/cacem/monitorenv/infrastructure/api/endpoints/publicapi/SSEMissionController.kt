package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.MissionDataOutput
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event
import java.util.*

@Component
class SSEMissionController {

    private val logger = LoggerFactory.getLogger(SSEMissionController::class.java)

    private val MISSION_UPDATE_EVENT_NAME = "MISSION_UPDATE"

    companion object {
        /**
         * This is used to stream missions to the listeners of a given missionId
         */
        private val sseStore = HashMap<Int, List<SseEmitter>>()
    }

    /**
     * This method register a listener for a given mission id
     */
    fun registerListener(missionId: Int): SseEmitter {
        logger.info("New listener of mission updates for mission id $missionId.")
        val sseEmitter = SseEmitter()

        val previousSseEmitters = sseStore[missionId] ?: listOf()
        sseStore[missionId] = previousSseEmitters + sseEmitter

        sseEmitter.onCompletion { removeClient(sseEmitter, missionId) }
        sseEmitter.onError { removeClient(sseEmitter, missionId) }
        sseEmitter.onTimeout { removeClient(sseEmitter, missionId) }

        return sseEmitter
    }

    fun removeClient(sseEmitter: SseEmitter, missionId: Int) {
        logger.info("Removing a listener (for mission id $missionId)")
        val sseEmitters = sseStore[missionId]

        if (sseEmitters == null) {
            logger.info("The listener could not be found in the map.")

            return
        }

        sseStore[missionId] = sseEmitters
            .filter { storedEmitter -> storedEmitter.hashCode() != sseEmitter.hashCode() }
    }

    /**
     * This method listen for `MissionEvent` to send to the frontend listeners
     */
    @EventListener(UpdateMissionEvent::class)
    fun handleUpdateMissionEvent(event: UpdateMissionEvent) {
        logger.info("Received mission event for mission ${event.mission.id}")
        val missionId = event.mission.id

        /**
         * Get the frontend connexions to stream to updated mission
         */
        val sseEmitters = sseStore[missionId] ?: return

        logger.info("Sending update of mission $missionId to ${sseEmitters.size} listener(s)")
        sseEmitters.forEach {
            try {
                val data = MissionDataOutput.fromMissionEntity(event.mission)
                logger.info(data.toString())
                val sseEvent = event()
                    .id(UUID.randomUUID().toString())
                    .name(MISSION_UPDATE_EVENT_NAME)
                    .data(data)
                    .build()

                it.send(sseEvent)

                it.complete()
            } catch (e: Exception) {
                it.completeWithError(e)
            }
        }
    }
}
