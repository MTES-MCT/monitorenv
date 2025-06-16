package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

interface IControlUnitResourceRepository {
    fun archiveById(controlUnitResourceId: Int)

    fun deleteById(controlUnitResourceId: Int)

    fun findById(controlUnitResourceId: Int): FullControlUnitResourceDTO?

    fun findAll(): List<FullControlUnitResourceDTO>

    fun findAllById(controlUnitResourceIds: List<Int>): List<FullControlUnitResourceDTO>

    fun save(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity
}
