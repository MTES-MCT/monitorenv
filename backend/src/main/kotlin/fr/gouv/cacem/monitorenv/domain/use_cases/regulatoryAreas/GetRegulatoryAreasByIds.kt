@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository

@UseCase
class GetRegulatoryAreasByIds(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    fun execute(ids: List<Int>): List<RegulatoryAreaEntity> = regulatoryAreaRepository.findAllByIds(ids)
}
