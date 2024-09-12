package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity

interface IVigilanceAreaImageRepository {
    fun save(image: ImageEntity): ImageEntity?
}
