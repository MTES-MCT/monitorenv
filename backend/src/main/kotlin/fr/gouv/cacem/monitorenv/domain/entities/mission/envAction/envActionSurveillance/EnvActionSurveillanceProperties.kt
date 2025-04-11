package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceProperties(
    val observations: String? = null,
    val awareness: AwarenessEntity? = null,
) {
    fun toEnvActionSurveillanceEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        actionEndDateTimeUtc: ZonedDateTime?,
        completedBy: String?,
        completion: ActionCompletionEnum?,
        controlPlans: List<EnvActionControlPlanEntity>?,
        department: String?,
        facade: String?,
        geom: Geometry?,
        observationsByUnit: String?,
        openBy: String?,
        themes: List<ThemeEntity>,
        tags: List<TagEntity>,
    ) = EnvActionSurveillanceEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionEndDateTimeUtc = actionEndDateTimeUtc,
        awareness = awareness,
        completedBy = completedBy,
        completion = completion,
        controlPlans = controlPlans,
        department = department,
        facade = facade,
        geom = geom,
        observations = observations,
        observationsByUnit = observationsByUnit,
        openBy = openBy,
        themes = themes,
        tags = tags,
    )

    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) =
            EnvActionSurveillanceProperties(
                observations = envAction.observations,
                awareness = envAction.awareness,
            )
    }
}
