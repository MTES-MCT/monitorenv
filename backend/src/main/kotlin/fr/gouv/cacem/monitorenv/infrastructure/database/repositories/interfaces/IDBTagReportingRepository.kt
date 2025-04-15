package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagReportingPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBTagReportingRepository : JpaRepository<TagReportingModel, TagReportingPk>
