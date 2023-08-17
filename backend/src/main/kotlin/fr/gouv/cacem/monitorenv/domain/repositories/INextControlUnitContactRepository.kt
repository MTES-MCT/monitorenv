package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity

interface INextControlUnitContactRepository {
    fun findById(nextControlUnitContactId: Int): NextControlUnitContactEntity

    fun findAll(): List<NextControlUnitContactEntity>

    fun save(nextControlUnitContactEntity: NextControlUnitContactEntity): NextControlUnitContactEntity
}
