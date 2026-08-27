package fr.gouv.cacem.monitorenv.domain.use_cases.facade

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.ISeaFrontRepository
import org.locationtech.jts.geom.Geometry

@UseCase
class ComputeSeaFrontFromGeometry(
    private val seaFrontRepository: ISeaFrontRepository,
) {
    fun execute(geometry: Geometry): String? {
        val facades = seaFrontRepository.findSeaFrontFromGeometry(geometry)

        return facades
    }
}
