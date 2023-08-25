package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

interface IBaseService {
    fun getById(baseId: Int): FullBaseDTO
}
