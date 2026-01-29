package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.NatinfModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBNatinfRepository : JpaRepository<NatinfModel, Int>
