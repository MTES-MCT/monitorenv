package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

interface IBaseRepository {
    fun deleteById(baseId: Int)

    fun findAll(): List<FullBaseDTO>

    fun findAllById(baseIds: List<Int>): List<FullBaseDTO>

    fun findById(baseId: Int): FullBaseDTO

    fun save(base: BaseEntity): BaseEntity
}
