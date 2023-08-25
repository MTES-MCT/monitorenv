package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity

interface INextControlUnitRepository {
    fun findById(controlUnitId: Int): NextControlUnitEntity

    fun findAll(): List<NextControlUnitEntity>

    fun save(controlUnit: NextControlUnitEntity): NextControlUnitEntity
}
