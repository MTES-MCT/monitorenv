package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel.ThemeNatinfPk
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBThemesNatinfRepository : CrudRepository<ThemeNatinfModel, ThemeNatinfPk> {
    @Query("SELECT DISTINCT themeNatinf FROM ThemeNatinfModel themeNatinf WHERE themeNatinf.id.themeId IN (:themesId)")
    fun findAllByThemesIds(themesId: List<Int>): List<ThemeNatinfModel>
}
