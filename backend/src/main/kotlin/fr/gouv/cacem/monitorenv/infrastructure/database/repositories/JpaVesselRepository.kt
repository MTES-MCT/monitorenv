package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLatestVesselRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLegalStatusRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNafRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVesselRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaVesselRepository(
    private val dbVesselRepository: IDBVesselRepository,
    private val dbLastestVesselRepository: IDBLatestVesselRepository,
    private val dbNafRepository: IDBNafRepository,
    private val dbLegalStatusRepository: IDBLegalStatusRepository,
) : IVesselRepository {
    private val logger: Logger = LoggerFactory.getLogger(JpaVesselRepository::class.java)

    override fun findVesselByShipId(
        shipId: Int,
        batchId: Int?,
        rowNumber: Int?,
    ): VesselEntity? =
        dbVesselRepository.findByShipIdAndBatchIdAndRowNumber(shipId, batchId, rowNumber)?.let {
            val nafLabel =
                if (!it.ownerBusinessSegment.isNullOrBlank()) {
                    dbNafRepository.findByIdOrNull(it.ownerBusinessSegment)?.label
                } else {
                    null
                }
            val legalStatusLabel =
                if (!it.ownerLegalStatus.isNullOrBlank()) {
                    dbLegalStatusRepository.findByIdOrNull(it.ownerLegalStatus)?.label
                } else {
                    null
                }
            return@let it.toVessel(nafLabel = nafLabel, legalStatusLabel = legalStatusLabel)
        }

    override fun search(searched: String): List<VesselEntity> {
        if (searched.isEmpty()) {
            return listOf()
        }

        return dbLastestVesselRepository.searchBy(searched).map { it.toVessel() }
    }
}
