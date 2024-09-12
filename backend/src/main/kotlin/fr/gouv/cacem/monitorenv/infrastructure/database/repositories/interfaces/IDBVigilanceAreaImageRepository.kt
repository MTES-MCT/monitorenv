package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaImageModel
import org.springframework.data.jpa.repository.JpaRepository


interface IDBVigilanceAreaImageRepository : JpaRepository<VigilanceAreaImageModel, Int>
