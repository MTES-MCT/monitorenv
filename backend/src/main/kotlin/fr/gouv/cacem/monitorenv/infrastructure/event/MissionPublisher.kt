package fr.gouv.cacem.monitorenv.infrastructure.event

import fr.gouv.cacem.monitorenv.domain.event.EventPublisher
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Component

@Component
class MissionPublisher(private val eventPublisher: ApplicationEventPublisher) : EventPublisher<UpdateMissionEvent> {
    override fun publish(event: UpdateMissionEvent) {
        eventPublisher.publishEvent(event)
    }
}
