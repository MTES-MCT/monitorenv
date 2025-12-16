package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionPK
import org.springframework.data.jpa.repository.JpaRepository

interface IDBAISPositionRepository : JpaRepository<AISPositionModel, AISPositionPK>
