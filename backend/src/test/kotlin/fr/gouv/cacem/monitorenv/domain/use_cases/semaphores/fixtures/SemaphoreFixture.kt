package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader

class SemaphoreFixture {
    companion object {
        fun aSemaphore(id: Int = 1): SemaphoreEntity {
            val wktReader = WKTReader()

            val pointString =
                "POINT (-4.54877816747593 48.305559876971)\""
            val point = wktReader.read(pointString) as Point

            return SemaphoreEntity(
                id = id,
                geom = point,
                name = "Dummy semaphore",
            )
        }
    }
}
