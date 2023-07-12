package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity

interface IAMPRepository {
    fun findAll(): List<AMPEntity>
    fun count(): Long
}
