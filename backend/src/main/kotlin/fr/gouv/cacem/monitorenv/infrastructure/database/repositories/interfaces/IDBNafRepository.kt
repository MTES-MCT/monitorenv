package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.NaflModel
import org.springframework.data.repository.CrudRepository

interface IDBNafRepository : CrudRepository<NaflModel, String>
