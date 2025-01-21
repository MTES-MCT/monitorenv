package fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.SeizureTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.WKTReader
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
            mapper: ObjectMapper,
            id: UUID,
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            observationsByUnit: String? = null,
            missionId: Int? = 1,
            controlPlans: List<EnvActionControlPlanEntity>? = null,
        ): EnvActionEntity {
            return EnvActionMapper.getEnvActionEntityFromJSON(
                mapper,
                id = id,
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionEndDateTimeUtc = endTime,
                actionStartDateTimeUtc = startTime,
                completedBy = "John Doe",
                completion = ActionCompletionEnum.COMPLETED,
                controlPlans = controlPlans,
                department = "Department X",
                facade = "Facade Y",
                geom = null,
                isAdministrativeControl = true,
                isComplianceWithWaterRegulationsControl = false,
                isSafetyEquipmentAndStandardsComplianceControl = true,
                isSeafarersControl = false,
                observationsByUnit = observationsByUnit,
                openBy = "Jane Doe",
                missionId = missionId,
                value = "{}",
            )
        }

        fun anEnvActionControl(
            startTime: ZonedDateTime? = null,
            openBy: String = "MPE",
            infractions: List<InfractionEntity> = listOf(),
            actionNumberOfControls: Int? = infractions.size,
            actionTargetTypeEnum: ActionTargetTypeEnum? = null,
            vehicleTypeEnum: VehicleTypeEnum? = null,
            controlPlans: List<EnvActionControlPlanEntity>? =
                listOf(EnvActionControlPlanEntity(subThemeIds = listOf(1))),
            geom: Geometry? = polygon,
        ): EnvActionControlEntity {
            return EnvActionControlEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                openBy = openBy,
                infractions = infractions,
                actionNumberOfControls = actionNumberOfControls,
                actionTargetType = actionTargetTypeEnum,
                vehicleType = vehicleTypeEnum,
                controlPlans = controlPlans,
                geom = geom,
            )
        }

        fun anEnvActionSurveillance(
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            openBy: String? = "CDA",
            controlPlans: List<EnvActionControlPlanEntity>? =
                listOf(EnvActionControlPlanEntity(subThemeIds = listOf(1))),
            geom: Geometry? = polygon,
        ): EnvActionSurveillanceEntity {
            return EnvActionSurveillanceEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                actionEndDateTimeUtc = endTime,
                openBy = openBy,
                awareness = null,
                controlPlans = controlPlans,
                geom = geom,
            )
        }

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

        fun aMonitorFishAction(missionId: Int): MonitorFishMissionActionEntity {
            return MonitorFishMissionActionEntity(
                id = 1,
                actionDatetimeUtc = ZonedDateTime.now().toString(),
                actionType = MonitorFishActionTypeEnum.AIR_CONTROL,
                completion = ActionCompletionEnum.COMPLETED,
                missionId = missionId,
                numberOfVesselsFlownOver = null,
            )
        }
    }
}
