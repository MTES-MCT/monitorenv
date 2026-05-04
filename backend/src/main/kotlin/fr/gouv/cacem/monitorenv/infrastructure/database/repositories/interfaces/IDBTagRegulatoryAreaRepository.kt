package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBTagRegulatoryAreaRepository : JpaRepository<TagRegulatoryAreaModel, TagRegulatoryAreaPk> {
    fun deleteAllByRegulatoryAreaId(regulatoryAreaId: Int)
}
