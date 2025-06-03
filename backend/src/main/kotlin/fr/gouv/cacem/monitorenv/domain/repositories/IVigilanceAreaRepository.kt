package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import org.locationtech.jts.geom.Geometry

interface IVigilanceAreaRepository {
    fun findAll(): List<VigilanceAreaEntity>

    fun findById(id: Int): VigilanceAreaEntity?

    fun save(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity

    fun delete(id: Int)

    fun archiveOutdatedVigilanceAreas(): Int

    fun findAllIdsByGeometryAndIsDraftIsFalse(geometry: Geometry): List<Int>

    fun findAllTrigrams(): List<String>
}
