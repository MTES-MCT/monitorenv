package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

interface IBaseRepository {
    fun findById(baseId: Int): BaseEntity

    fun findAll(): List<BaseEntity>

    fun save(baseEntity: BaseEntity): BaseEntity
}
