package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity

interface IVigilanceAreaRepository {
    fun findAll(): List<VigilanceAreaEntity>
    fun findById(id: Int): VigilanceAreaEntity?
    fun save(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity
    fun delete(id: Int)
}
