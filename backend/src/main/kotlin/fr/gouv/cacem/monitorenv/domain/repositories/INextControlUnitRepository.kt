package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity

interface INextControlUnitRepository {
    fun findById(nextControlUnitId: Int): NextControlUnitEntity

    fun findAll(): List<NextControlUnitEntity>

    fun save(nextControlUnitEntity: NextControlUnitEntity): NextControlUnitEntity
}
