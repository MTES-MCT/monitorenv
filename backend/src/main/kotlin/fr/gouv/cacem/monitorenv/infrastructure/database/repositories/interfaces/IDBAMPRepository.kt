package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AMPModel
import org.springframework.data.repository.CrudRepository

interface IDBAMPRepository : CrudRepository<AMPModel, Int>