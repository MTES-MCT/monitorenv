package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository

@UseCase
class DeleteControlUnit(
    private val controlUnitRepository: IControlUnitRepository,
    private val canDeleteControlUnit: CanDeleteControlUnit,
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository,
) {
    fun execute(controlUnitId: Int) {
        if (!canDeleteControlUnit.execute(controlUnitId)) {
            throw CouldNotDeleteException(
                "Cannot delete control unit  (ID=$controlUnitId) due to existing relationships.",
            )
        }

        val deletedMissions = missionRepository.findByControlUnitId(controlUnitId).filter { it.isDeleted }
        val deletedReportings = reportingRepository.findByControlUnitId(controlUnitId).filter { it.isDeleted }

        deletedMissions.forEach { deletedMission ->
            missionRepository.save(
                deletedMission.copy(
                    controlUnits =
                    deletedMission.controlUnits.filter {
                            controlUnit ->
                        controlUnit.id != controlUnitId
                    },
                ),
            )
        }

        deletedReportings.forEach { deletedReporting ->
            reportingRepository.save(
                deletedReporting.copy(
                    controlUnitId = null,
                ),
            )
        }

        return controlUnitRepository.deleteById(controlUnitId)
    }
}
