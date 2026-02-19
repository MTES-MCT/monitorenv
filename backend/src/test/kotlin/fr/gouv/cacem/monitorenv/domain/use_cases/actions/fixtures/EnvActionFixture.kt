package fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlWithInfractionsEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.SeizureTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.WKTReader
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime
import java.util.UUID
import kotlin.random.Random

private val polygon =
    WKTReader()
        .read(
            "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
        )

class EnvActionFixture {
    companion object {
        fun anEnvAction(
            mapper: JsonMapper,
            id: UUID,
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            observationsByUnit: String? = null,
            tags: List<TagEntity> = listOf(),
            themes: List<ThemeEntity> = listOf(),
        ): EnvActionEntity =
            EnvActionMapper.getEnvActionEntityFromJSON(
                mapper,
                id = id,
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionEndDateTimeUtc = endTime,
                actionStartDateTimeUtc = startTime,
                completedBy = "John Doe",
                completion = ActionCompletionEnum.COMPLETED,
                department = "Department X",
                facade = "Facade Y",
                geom = null,
                isAdministrativeControl = true,
                isComplianceWithWaterRegulationsControl = false,
                isSafetyEquipmentAndStandardsComplianceControl = true,
                isSeafarersControl = false,
                observationsByUnit = observationsByUnit,
                openBy = "Jane Doe",
                value = "{}",
                tags = tags,
                themes = themes,
            )

        fun anEnvActionControl(
            startTime: ZonedDateTime? = null,
            openBy: String = "MPE",
            infractions: List<InfractionEntity> = listOf(),
            actionNumberOfControls: Int? = infractions.size,
            actionTargetTypeEnum: ActionTargetTypeEnum? = null,
            vehicleTypeEnum: VehicleTypeEnum? = null,
            geom: Geometry? = polygon,
            themes: List<ThemeEntity> = listOf(),
        ): EnvActionControlEntity =
            EnvActionControlEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                openBy = openBy,
                infractions = infractions,
                actionNumberOfControls = actionNumberOfControls,
                actionTargetType = actionTargetTypeEnum,
                vehicleType = vehicleTypeEnum,
                geom = geom,
                tags = listOf(),
                themes = themes,
            )

        fun anEnvActionSurveillance(
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            openBy: String? = "CDA",
            geom: Geometry? = polygon,
        ): EnvActionSurveillanceEntity =
            EnvActionSurveillanceEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                actionEndDateTimeUtc = endTime,
                openBy = openBy,
                awareness = null,
                geom = geom,
                tags = listOf(),
                themes = listOf(),
            )

        fun anInfraction(
            infractionType: InfractionTypeEnum = InfractionTypeEnum.WITHOUT_REPORT,
            administrativeResponse: AdministrativeResponseEnum = AdministrativeResponseEnum.NONE,
            seizure: SeizureTypeEnum = SeizureTypeEnum.NO,
            formalNotice: FormalNoticeEnum = FormalNoticeEnum.NO,
            nbTarget: Int = 1,
            natinf: List<String> = listOf("1234"),
        ) = InfractionEntity(
            id = Random.nextInt().toString(),
            administrativeResponse = administrativeResponse,
            infractionType = infractionType,
            formalNotice = formalNotice,
            seizure = seizure,
            nbTarget = nbTarget,
            natinf = natinf,
        )

        fun aMonitorFishAction(missionId: Int): MonitorFishMissionActionEntity =
            MonitorFishMissionActionEntity(
                id = 1,
                actionDatetimeUtc = ZonedDateTime.now().toString(),
                actionType = MonitorFishActionTypeEnum.AIR_CONTROL,
                completion = ActionCompletionEnum.COMPLETED,
                missionId = missionId,
                numberOfVesselsFlownOver = null,
            )

        fun anEnvActionControlWithInfractions(
            startTime: ZonedDateTime? = null,
            infractions: List<InfractionEntity> = listOf(),
            themes: List<String> = listOf(),
            controlUnits: List<String> = listOf(),
        ): EnvActionControlWithInfractionsEntity =
            EnvActionControlWithInfractionsEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                infractions = infractions,
                themes = themes,
                controlUnits = controlUnits,
            )
    }
}
