package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeVigilanceAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeVigilanceAreaModel.ThemeVigilanceAreaPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBThemeVigilanceAreaRepository : JpaRepository<ThemeVigilanceAreaModel, ThemeVigilanceAreaPk> {
    fun deleteAllByVigilanceAreaId(vigilanceAreaId: Int)
}
