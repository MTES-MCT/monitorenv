package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBTagRegulatoryAreaRepository : JpaRepository<TagRegulatoryAreaNewModel, TagRegulatoryAreaNewPk> {
    fun deleteAllByRegulatoryAreaId(regulatoryAreaId: Int)
}
