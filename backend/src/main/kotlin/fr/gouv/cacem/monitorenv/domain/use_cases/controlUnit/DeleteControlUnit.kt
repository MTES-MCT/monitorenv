package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingSourceRepository
import org.slf4j.LoggerFactory

@UseCase
class DeleteControlUnit(
    private val controlUnitRepository: IControlUnitRepository,
    private val canDeleteControlUnit: CanDeleteControlUnit,
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository,
    private val reportingSourceRepository: IReportingSourceRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteControlUnit::class.java)

    fun execute(controlUnitId: Int) {
        logger.info("Attempt to DELETE control unit $controlUnitId")
        if (!canDeleteControlUnit.execute(controlUnitId)) {
            throw CouldNotDeleteException(
                "Cannot delete control unit  (ID=$controlUnitId) due to existing relationships.",
            )
        }

        val deletedMissions = missionRepository.findByControlUnitId(controlUnitId).filter { it.isDeleted }
        val deletedReportings = reportingRepository.findByControlUnitId(controlUnitId).filter { it.isDeleted }

        deletedMissions.forEach { deletedMission ->
            // TODO: use saveAll
            missionRepository.save(
                deletedMission.copy(
                    controlUnits =
                        deletedMission.controlUnits.filter { controlUnit ->
                            controlUnit.id != controlUnitId
                        },
                ),
            )
        }

        deletedReportings.forEach { deletedReporting ->
            deletedReporting.reportingSources.forEach {
                // TODO: use saveAll
                reportingSourceRepository.save(it.copy(controlUnitId = null))
            }
        }

        controlUnitRepository.deleteById(controlUnitId)
        logger.info("Control unit $controlUnitId deleted")
    }
}
