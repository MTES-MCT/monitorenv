package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity

interface INextControlUnitResourceRepository {
    fun findById(nextControlUnitResourceId: Int): NextControlUnitResourceEntity

    fun findAll(): List<NextControlUnitResourceEntity>

    fun save(nextControlUnitResourceEntity: NextControlUnitResourceEntity): NextControlUnitResourceEntity
}
