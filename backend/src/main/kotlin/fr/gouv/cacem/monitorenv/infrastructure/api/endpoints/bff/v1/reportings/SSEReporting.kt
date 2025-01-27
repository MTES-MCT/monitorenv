package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.reportings

import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.events.UpdateReportingEvent
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingDataOutput
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event
import java.time.ZonedDateTime

@Component
class SSEReporting {
    private val logger = LoggerFactory.getLogger(SSEReporting::class.java)
    val mutexLock = Any()

    private val REPORTING_UPDATE_EVENT_NAME = "REPORTING_UPDATE"
    private val TWENTY_FOUR_HOURS = (24 * 60 * 60 * 1000).toLong()

    companion object {
        /** This is used to store the SSE listeners */
        private val sseStore = mutableListOf<SseEmitter>()
    }

    /** This method register a listener for a given reporting id */
    fun registerListener(): SseEmitter {
        logger.info("Adding new SSE listener of reporting updates at ${ZonedDateTime.now()}.")
        val sseEmitter = SseEmitter(TWENTY_FOUR_HOURS)

        synchronized(mutexLock) { sseStore.add(sseEmitter) }

        sseEmitter.onTimeout { removeClient(sseEmitter) }

        return sseEmitter
    }

    fun removeClient(sseEmitter: SseEmitter) {
        logger.info("Removing a SSE listener of reporting updates.")
        synchronized(mutexLock) { sseStore.remove(sseEmitter) }

        sseEmitter.complete()
    }

    /** This method listen for `ReportingEvent` to send to the frontend listeners */
    @Async
    @EventListener(UpdateReportingEvent::class)
    fun handleUpdateReportingEvent(event: UpdateReportingEvent) {
        logger.info("SSE: Received reporting event for reporting ${event.reporting.reporting.id}.")
        val reportingId = event.reporting.reporting.id

        logger.info(
            "SSE: Sending update of reporting $reportingId to ${sseStore.size} listener(s).",
        )
        val sseEmittersToRemove =
            sseStore.map { sseEmitter ->
                try {
                    val data = ReportingDataOutput.fromReportingDTO(event.reporting)
                    val sseEvent =
                        event().name(REPORTING_UPDATE_EVENT_NAME)
                            .data(data)
                            .reconnectTime(0)
                            .build()

                    sseEmitter.send(sseEvent)
                    sseEmitter.complete()

                    return@map sseEmitter
                } catch (e: Exception) {
                    logger.info("Error when sending reporting event with id ${event.reporting.reporting.id} : $e")
                    sseEmitter.completeWithError(e)

                    return@map sseEmitter
                }
            }

        synchronized(mutexLock) { sseStore.removeAll(sseEmittersToRemove) }
        logger.info("Removed ${sseEmittersToRemove.size} SSE listeners of reporting updates.")
    }
}
