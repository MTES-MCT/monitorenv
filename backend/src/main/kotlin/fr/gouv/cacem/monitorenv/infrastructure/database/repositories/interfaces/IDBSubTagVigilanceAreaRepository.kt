package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.SubTagVigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.SubTagVigilanceAreaPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBSubTagVigilanceAreaRepository : JpaRepository<SubTagVigilanceAreaModel, SubTagVigilanceAreaPk> {
    fun deleteAllByVigilanceAreaId(vigilanceAreaId: Int)
}
