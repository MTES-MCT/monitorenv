package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.lastPositions.LastPositionEntity

interface ILastPositionRepository {
    fun findAll(shipId: Int): List<LastPositionEntity>
}
