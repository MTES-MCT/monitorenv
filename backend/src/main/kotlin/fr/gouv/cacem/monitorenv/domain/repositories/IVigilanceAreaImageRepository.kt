package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.files.ImageEntity

interface IVigilanceAreaImageRepository {
    fun save(image: ImageEntity): ImageEntity?
}
