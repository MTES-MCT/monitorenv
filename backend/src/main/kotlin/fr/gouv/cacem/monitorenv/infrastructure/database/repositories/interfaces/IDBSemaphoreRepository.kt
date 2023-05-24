package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.SemaphoreModel
import org.springframework.data.repository.CrudRepository

interface IDBSemaphoreRepository : CrudRepository<SemaphoreModel, Int>
