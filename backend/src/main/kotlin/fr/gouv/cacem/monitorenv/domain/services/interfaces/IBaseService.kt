package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

interface IBaseService {
    fun getById(baseId: Int): BaseEntity
}
