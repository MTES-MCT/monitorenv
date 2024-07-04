package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBVigilanceAreaRepository : JpaRepository<VigilanceAreaModel, Int>
