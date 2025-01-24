package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.missions

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.MissionWithRapportNavActionsDataOutput
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event
import java.time.ZonedDateTime

@Component
class SSEMission {
    private val logger = LoggerFactory.getLogger(SSEMission::class.java)
    val mutexLock = Any()

    private val MISSION_UPDATE_EVENT_NAME = "MISSION_UPDATE"
    private val TWENTY_FOUR_HOURS = (24 * 60 * 60 * 1000).toLong()

    companion object {
        /**
         * This is used to store the SSE listeners
         */
        private val sseStore = mutableListOf<SseEmitter>()
    }

    /**
     * This method register a listener for a given mission id
     */
    fun registerListener(): SseEmitter {
        logger.info("Adding new SSE listener of mission updates at ${ZonedDateTime.now()}.")
        val sseEmitter = SseEmitter(TWENTY_FOUR_HOURS)

        synchronized(mutexLock) {
            sseStore.add(sseEmitter)
        }

        sseEmitter.onTimeout { removeClient(sseEmitter) }

        return sseEmitter
    }

    fun removeClient(sseEmitter: SseEmitter) {
        logger.info("Removing a SSE listener of mission updates.")
        synchronized(mutexLock) {
            sseStore.remove(sseEmitter)
        }

        sseEmitter.complete()
    }

    /**
     * This method listen for `MissionEvent` to send to the frontend listeners
     */
    @Async
    @EventListener(UpdateMissionEvent::class)
    fun handleUpdateMissionEvent(event: UpdateMissionEvent) {
        logger.info("SSE: Received mission event for mission ${event.mission.id}.")
        val missionId = event.mission.id

        logger.info("SSE: Sending update of mission $missionId to ${sseStore.size} listener(s).")
        val sseEmittersToRemove =
            sseStore.map { sseEmitter ->
                try {
                    val data = MissionWithRapportNavActionsDataOutput.fromMissionEntity(event.mission)
                    val sseEvent =
                        event()
                            .name(MISSION_UPDATE_EVENT_NAME)
                            .data(data)
                            .reconnectTime(0)
                            .build()

                    sseEmitter.send(sseEvent)
                    sseEmitter.complete()

                    return@map sseEmitter
                } catch (e: Exception) {
                    logger.info("Error when send mission event with id ${event.mission.id} : $e")
                    sseEmitter.completeWithError(e)

                    return@map sseEmitter
                }
            }

        synchronized(mutexLock) {
            sseStore.removeAll(sseEmittersToRemove)
        }
        logger.info("Removed ${sseEmittersToRemove.size} SSE listeners of mission updates.")
    }
}
