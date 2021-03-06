package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.InfractionModel
import org.springframework.data.repository.CrudRepository

interface IDBInfractionRepository: CrudRepository<InfractionModel, Int> {
}