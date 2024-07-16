package fr.gouv.cacem.monitorenv.domain.event

interface EventPublisher<T> {
    fun publish(event: T)
}
