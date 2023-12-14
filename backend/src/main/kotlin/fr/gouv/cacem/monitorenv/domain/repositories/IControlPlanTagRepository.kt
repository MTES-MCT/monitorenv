package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity

interface IControlPlanTagRepository {
    fun findAll(): List<ControlPlanTagEntity>
}
