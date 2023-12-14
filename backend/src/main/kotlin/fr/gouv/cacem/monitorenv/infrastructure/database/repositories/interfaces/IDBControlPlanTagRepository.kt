package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanTagModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBControlPlanTagRepository : JpaRepository<ControlPlanTagModel, Int>
