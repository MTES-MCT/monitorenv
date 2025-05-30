package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity

interface ILocalizedAreasRepository {
    fun findAll(): List<LocalizedAreaEntity>
}
