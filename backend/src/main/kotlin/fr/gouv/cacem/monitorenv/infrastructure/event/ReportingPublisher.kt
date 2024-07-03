package fr.gouv.cacem.monitorenv.infrastructure.event

import fr.gouv.cacem.monitorenv.domain.event.EventPublisher
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.events.UpdateReportingEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Component

@Component
class ReportingPublisher(private val eventPublisher: ApplicationEventPublisher) : EventPublisher<UpdateReportingEvent> {
    override fun publish(event: UpdateReportingEvent) {
        eventPublisher.publishEvent(event)
    }
}
