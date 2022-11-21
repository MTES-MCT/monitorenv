package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlThemeModel
import org.springframework.data.repository.CrudRepository

interface IDBControlThemeRepository : CrudRepository<ControlThemeModel, Int>
