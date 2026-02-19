package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RefNatinfModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBRefNatinfRepository : JpaRepository<RefNatinfModel, Int>
