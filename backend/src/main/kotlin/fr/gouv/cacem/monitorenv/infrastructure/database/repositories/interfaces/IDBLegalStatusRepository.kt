package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.LegalStatusModel
import org.springframework.data.repository.CrudRepository

interface IDBLegalStatusRepository : CrudRepository<LegalStatusModel, String>
