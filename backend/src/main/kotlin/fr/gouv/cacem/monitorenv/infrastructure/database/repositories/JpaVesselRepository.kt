package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselAdditionalInformationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselFileModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLatestVesselRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLegalStatusRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNafRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVesselAdditionalInformationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVesselFilesRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVesselRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVesselRepository(
    private val dbVesselRepository: IDBVesselRepository,
    private val dbVesselAdditionalInformationRepository: IDBVesselAdditionalInformationRepository,
    private val dbVesselFilesRepository: IDBVesselFilesRepository,
    private val dbLastestVesselRepository: IDBLatestVesselRepository,
    private val dbNafRepository: IDBNafRepository,
    private val dbLegalStatusRepository: IDBLegalStatusRepository,
) : IVesselRepository {
    override fun findVesselByVesselId(vesselId: VesselIdEntity): VesselEntity? =
        dbVesselRepository
            .findByShipIdAndBatchIdAndRowNumber(
                shipId = vesselId.shipId,
                batchId = vesselId.batchId,
                rowNumber = vesselId.rowNumber,
            )?.let {
                val ownerBusinessSegment = it.ownerBusinessSegment
                val nafLabel =
                    if (!ownerBusinessSegment.isNullOrBlank()) {
                        dbNafRepository.findByIdOrNull(ownerBusinessSegment)?.label
                    } else {
                        null
                    }
                val ownerLegalStatus = it.ownerLegalStatus
                val legalStatusLabel =
                    if (!ownerLegalStatus.isNullOrBlank()) {
                        dbLegalStatusRepository.findByIdOrNull(ownerLegalStatus)?.label
                    } else {
                        null
                    }
                val additionalInformation =
                    dbVesselAdditionalInformationRepository.findByShipIdAndBatchIdAndRowNumber(
                        shipId = vesselId.shipId,
                        batchId = vesselId.batchId,
                        rowNumber = vesselId.rowNumber,
                    )
                val files =
                    dbVesselFilesRepository.findAllByShipIdAndBatchIdAndRowNumber(
                        shipId = vesselId.shipId,
                        batchId = vesselId.batchId,
                        rowNumber = vesselId.rowNumber,
                    )
                return@let it.toVessel(
                    additionalInformation = additionalInformation,
                    nafLabel = nafLabel,
                    legalStatusLabel = legalStatusLabel,
                    files = files,
                )
            }

    override fun search(searched: String): List<VesselEntity> {
        if (searched.isEmpty()) {
            return listOf()
        }

        return dbLastestVesselRepository.searchBy(searched).map { it.toVessel() }
    }

    @Transactional
    override fun saveAdditionalInformation(
        vesselId: VesselIdEntity,
        vesselAdditionalInformation: VesselAdditionalInformationEntity,
    ): VesselAdditionalInformationEntity =
        dbVesselAdditionalInformationRepository
            .save(
                VesselAdditionalInformationModel.fromVesselAdditionalInformation(
                    vesselId = vesselId,
                    vesselAdditionalInformation = vesselAdditionalInformation,
                ),
            ).toVesselAdditionalInformation()

    @Transactional
    override fun saveFiles(
        vesselId: VesselIdEntity,
        vesselFiles: List<VesselFileEntity>,
    ): List<VesselFileEntity> {
        dbVesselFilesRepository.deleteAllByShipIdAndBatchIdAndRowNumber(
            batchId = vesselId.batchId,
            rowNumber = vesselId.rowNumber,
            shipId = vesselId.shipId,
        )
        return dbVesselFilesRepository
            .saveAll(
                vesselFiles.map {
                    VesselFileModel.fromVesselFileEntity(
                        vesselId = vesselId,
                        vesselFile = it,
                    )
                },
            ).map { it.toVesselFile() }
    }
}
