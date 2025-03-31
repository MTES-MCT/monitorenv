package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBTagVigilanceAreaRepository : JpaRepository<TagVigilanceAreaModel, TagVigilanceAreaPk> {
    fun deleteAllByVigilanceAreaId(vigilanceAreaId: Int)
}
