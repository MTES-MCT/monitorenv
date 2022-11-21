package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity

interface IControlResourceRepository {
    fun findControlResources(): List<ControlResourceEntity>
}
