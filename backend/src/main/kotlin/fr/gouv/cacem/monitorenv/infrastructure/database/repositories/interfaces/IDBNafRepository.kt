package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.NafModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBNafRepository : JpaRepository<NafModel, String>
