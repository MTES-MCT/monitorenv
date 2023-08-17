package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitResourceRepository

@UseCase
class CreateOrUpdateNextControlUnitResource(private val nextControlUnitResourceRepository: INextControlUnitResourceRepository) {
    fun execute(nextControlUnitResourceEntity: NextControlUnitResourceEntity): NextControlUnitResourceEntity {
        return nextControlUnitResourceRepository.save(nextControlUnitResourceEntity)
    }
}
