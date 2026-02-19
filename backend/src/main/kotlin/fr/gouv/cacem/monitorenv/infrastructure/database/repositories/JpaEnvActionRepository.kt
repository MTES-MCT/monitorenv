package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlWithInfractionsEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.recentActivity.RecentControlActivityProperties
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.projections.EnvActionControlWithInfractions
import org.geolatte.geom.MultiPoint
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.UUID

@Repository
class JpaEnvActionRepository(
    private val idbEnvActionRepository: IDBEnvActionRepository,
    private val idbMissionRepository: IDBMissionRepository,
    private val jsonMapper: JsonMapper,
) : IEnvActionRepository {
    @Transactional
    override fun findById(id: UUID): EnvActionEntity? =
        idbEnvActionRepository.findByIdOrNull(id)?.toActionEntity(jsonMapper)

    @Transactional
    override fun save(envAction: EnvActionEntity): EnvActionEntity {
        val mission: MissionModel? = idbMissionRepository.findByEnvActionId(envAction.id)
        mission?.let {
            return idbEnvActionRepository
                .save(
                    EnvActionModel.fromEnvActionEntity(
                        envAction,
                        mission = mission,
                        mapper = jsonMapper,
                    ),
                ).toActionEntity(jsonMapper)
        }

        throw BackendUsageException(
            code = BackendUsageErrorCode.ENTITY_NOT_FOUND,
            data = "Trying to save an envAction without mission",
        )
    }

    override fun getRecentControlsActivity(
        administrationIds: List<Int>?,
        controlUnitIds: List<Int>?,
        geometry: Geometry?,
        themeIds: List<Int>?,
        startedAfter: Instant,
        startedBefore: Instant,
    ): List<RecentControlsActivityListDTO> =
        idbEnvActionRepository
            .getRecentControlsActivity(
                administrationIds = administrationIds ?: emptyList(),
                controlUnitIds = controlUnitIds ?: emptyList(),
                geometry = geometry,
                startedAfter = startedAfter,
                startedBefore = startedBefore,
                themeIds = themeIds ?: emptyList(),
            ).map { row ->

                // convert geometry to JTS Geometry
                val geomFactory = GeometryFactory()
                val geom =
                    when (val rawGeom = row[4]) {
                        is MultiPoint<*> -> {
                            val coordinates =
                                rawGeom.positions
                                    .map { position ->
                                        val longitude =
                                            position.getCoordinate(0)
                                        val latitude = position.getCoordinate(1)
                                        Coordinate(longitude, latitude)
                                    }.toTypedArray()
                            geomFactory.createMultiPointFromCoords(coordinates)
                        }

                        else -> null
                    }

                // convert LocalDateTime to ZonedDateTime
                val localDateTime = row[3] as? LocalDateTime
                val zonedDateTime = localDateTime?.atZone(ZoneId.of("UTC"))

                // convert valueJson to RecentControlActivityProperties
                val valueJson = row[2] as String
                val valueObject =
                    jsonMapper.readValue(
                        valueJson,
                        RecentControlActivityProperties::class.java,
                    )

                RecentControlsActivityListDTO(
                    id = row[0] as UUID,
                    missionId = row[1] as Int,
                    actionStartDateTimeUtc = zonedDateTime as ZonedDateTime,
                    geom = geom as Geometry,
                    facade = row[5] as? String,
                    department = row[6] as? String,
                    themesIds = (row[7] as Array<Int>).toList(),
                    subThemesIds = (row[8] as Array<Int>).toList(),
                    controlUnitsIds = (row[9] as Array<Int>).toList(),
                    administrationIds = (row[10] as Array<Int>).toList(),
                    actionNumberOfControls = valueObject.actionNumberOfControls,
                    actionTargetType = valueObject.actionTargetType,
                    vehicleType = valueObject.vehicleType,
                    infractions = valueObject.infractions,
                    observations = valueObject.observations,
                )
            }

    @Transactional
    override fun findAllByMmsi(
        mmsi: String,
        idToExclude: UUID?,
    ): List<EnvActionControlWithInfractionsEntity> {
        val envActions = idbEnvActionRepository.findAllEnvActionByMmsi(mmsi, idToExclude)

        return envActions.map { row: EnvActionControlWithInfractions ->
            val infractionsJson = row.getInfractions()
            val infractions: List<InfractionEntity> =
                jsonMapper.readValue(infractionsJson, Array<InfractionEntity>::class.java).toList()
            val actionStartDateTimeUtc = row.getActionStartDatetimeUtc()?.atZone(ZoneOffset.UTC)

            EnvActionControlWithInfractionsEntity(
                actionStartDateTimeUtc = actionStartDateTimeUtc,
                controlUnits = row.getControlUnits().toList(),
                id = row.getId(),
                infractions = infractions,
                missionId = row.getMissionId(),
                themes = row.getThemes().toList(),
            )
        }
    }
}
