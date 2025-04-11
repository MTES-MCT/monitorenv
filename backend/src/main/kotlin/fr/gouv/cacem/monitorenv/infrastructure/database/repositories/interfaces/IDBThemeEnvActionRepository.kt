package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeEnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeEnvActionPk
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IDBThemeEnvActionRepository : JpaRepository<ThemeEnvActionModel, ThemeEnvActionPk> {
    fun deleteAllByEnvActionId(envActionId: UUID)
}
