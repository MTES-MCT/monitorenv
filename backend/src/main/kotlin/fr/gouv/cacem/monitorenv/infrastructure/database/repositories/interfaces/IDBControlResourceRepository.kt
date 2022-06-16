package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlResourceModel
import org.springframework.data.repository.CrudRepository

interface IDBControlResourceRepository : CrudRepository<ControlResourceModel, Int> {
}
