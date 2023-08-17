package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.LegacyControlUnitModel
import org.springframework.data.repository.CrudRepository

interface IDBControlUnitRepository : CrudRepository<LegacyControlUnitModel, Int>
