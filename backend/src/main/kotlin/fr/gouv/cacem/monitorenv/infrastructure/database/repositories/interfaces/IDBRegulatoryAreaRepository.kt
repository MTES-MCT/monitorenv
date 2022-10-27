package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces


import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.locationtech.jts.geom.MultiPolygon
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBRegulatoryAreaRepository : CrudRepository<RegulatoryAreaModel, Int> {
}
