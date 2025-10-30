package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaAMPRepository(
    private val dbAMPRepository: IDBAMPRepository,
) : IAMPRepository {
    override fun findAll(
        withGeometry: Boolean,
        zoom: Int?,
        bbox: List<Double>?,
    ): List<AMPEntity> =
        dbAMPRepository
            .findAllByOrderByName(
                zoom,
                bbox?.get(0),
                bbox?.get(1),
                bbox?.get(2),
                bbox?.get(3),
                withGeometry,
            ).map { it.toAMP() }

    override fun count(): Long = dbAMPRepository.count()

    override fun findAllIdsByGeometry(geometry: Geometry): List<Int> = dbAMPRepository.findAllIdsByGeom(geometry)

    override fun findAllByIds(ids: List<Int>): List<AMPEntity> = dbAMPRepository.findAllById(ids).map { it.toAMP() }

    override fun findById(id: Int): AMPEntity? = dbAMPRepository.findByIdOrNull(id)?.toAMP()
}
