package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaSourceModel
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IDBVigilanceAreaSourceRepository : JpaRepository<VigilanceAreaSourceModel, UUID> {
    fun deleteAllByVigilanceAreaId(vigilanceAreaId: Int)
    fun deleteAllByControlUnitContactId(controlUnitContactId: Int)
}
