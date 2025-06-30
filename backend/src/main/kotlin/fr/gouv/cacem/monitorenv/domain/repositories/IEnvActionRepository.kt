package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import org.locationtech.jts.geom.Geometry
import java.time.Instant
import java.util.UUID

interface IEnvActionRepository {
    fun findById(id: UUID): EnvActionEntity?

    fun save(envAction: EnvActionEntity): EnvActionEntity

    fun getRecentControlsActivity(
        administrationIds: List<Int>?,
        controlUnitIds: List<Int>?,
        geometry: Geometry?,
        themeIds: List<Int>?,
        startedAfter: Instant,
        startedBefore: Instant,
    ): List<RecentControlsActivityListDTO>

    fun findAllByMmsi(mmsi: String): List<EnvActionEntity>
}
