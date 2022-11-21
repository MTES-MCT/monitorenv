package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.NatinfModel
import org.springframework.data.repository.CrudRepository

interface IDBNatinfRepository : CrudRepository<NatinfModel, Int>
