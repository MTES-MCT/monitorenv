package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.LocalizedAreaModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBLocalizedAreaRepository : JpaRepository<LocalizedAreaModel, Int>
