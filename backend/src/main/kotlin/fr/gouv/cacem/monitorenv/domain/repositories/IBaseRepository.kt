package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

interface IBaseRepository {
    fun deleteById(baseId: Int)

    fun findById(baseId: Int): FullBaseDTO

    fun findAll(): List<FullBaseDTO>

    fun save(base: BaseEntity): BaseEntity
}
