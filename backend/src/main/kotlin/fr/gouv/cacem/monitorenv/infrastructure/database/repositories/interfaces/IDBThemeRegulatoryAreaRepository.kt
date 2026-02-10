package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBThemeRegulatoryAreaRepository : JpaRepository<ThemeRegulatoryAreaNewModel, ThemeRegulatoryAreaNewPk> {
    fun deleteAllByRegulatoryAreaId(regulatoryAreaId: Int)
}
