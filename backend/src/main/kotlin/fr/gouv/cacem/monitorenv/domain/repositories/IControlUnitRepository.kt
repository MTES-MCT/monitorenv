package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

interface IControlUnitRepository {
    fun archiveById(controlUnitId: Int)

    fun deleteById(controlUnitId: Int)

    fun findById(controlUnitId: Int): ControlUnitEntity

    fun findFullControlUnitById(controlUnitId: Int): FullControlUnitDTO

    fun findAll(): List<FullControlUnitDTO>

    fun save(controlUnit: ControlUnitEntity): ControlUnitEntity
}
