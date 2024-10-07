package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefingEntity

interface IBriefingRepository {
    fun saveAll(briefings: List<BriefingEntity>): List<BriefingEntity>
}
