package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlThemeModel
import org.springframework.data.repository.CrudRepository

@Deprecated("Use IDBControlPlanThemeRepository instead")
interface IDBControlThemeRepository : CrudRepository<ControlThemeModel, Int>
