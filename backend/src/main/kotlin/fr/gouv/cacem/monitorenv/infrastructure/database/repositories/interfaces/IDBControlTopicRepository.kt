package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlTopicModel
import org.springframework.data.repository.CrudRepository

interface IDBControlTopicRepository : CrudRepository<ControlTopicModel, Int> {
}
