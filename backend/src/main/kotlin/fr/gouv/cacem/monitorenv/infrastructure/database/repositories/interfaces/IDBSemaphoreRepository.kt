package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.SemaphoreModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBSemaphoreRepository : JpaRepository<SemaphoreModel, Int>
