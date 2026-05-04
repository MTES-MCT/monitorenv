package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBThemeRegulatoryAreaRepository : JpaRepository<ThemeRegulatoryAreaModel, ThemeRegulatoryAreaPk> {
    fun deleteAllByRegulatoryAreaId(regulatoryAreaId: Int)
}
