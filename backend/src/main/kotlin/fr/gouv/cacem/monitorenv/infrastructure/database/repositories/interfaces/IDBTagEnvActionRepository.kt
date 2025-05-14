package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagEnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagEnvActionPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBTagEnvActionRepository : JpaRepository<TagEnvActionModel, TagEnvActionPk>
