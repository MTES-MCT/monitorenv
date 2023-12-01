package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanSubThemeEntity
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import org.hibernate.annotations.Type
import java.io.Serializable
import java.util.UUID

@Entity
@Table(name = "env_actions_subthemes")
data class EnvActionsSubThemeModel(

    @EmbeddedId
    val id: EnvActionsSubThemePk,

    @ManyToOne
    @MapsId("envActionId")
    @JoinColumn(name = "env_action_id")
    val envAction: EnvActionModel? = null,

    @ManyToOne
    @MapsId("subthemeId")
    @JoinColumn(name = "subtheme_id")
    val controlPlanSubTheme: ControlPlanSubThemeModel? = null,

    @Column(name = "tags")
    @Type(ListArrayType::class)
    val tags: List<String>? = null,
) {
    fun toEnvActionControlPlanSubThemeEntity(): EnvActionControlPlanSubThemeEntity {
        require(controlPlanSubTheme != null) { "controlPlanSubTheme must not be null when converting to Entity" }
        return EnvActionControlPlanSubThemeEntity(
            subThemeId = controlPlanSubTheme.id,
            theme = controlPlanSubTheme.ControlPlanTheme.theme,
            subTheme = controlPlanSubTheme.subTheme,
            tags = tags ?: emptyList(),
        )
    }
    companion object {
        fun fromEnvActionControlPlanSubThemeEntity(
            envActionId: UUID,
            envActionControlPlanSubTheme: EnvActionControlPlanSubThemeEntity,
        ) = EnvActionsSubThemeModel(
            id = EnvActionsSubThemePk(
                envActionId = envActionId,
                subthemeId = envActionControlPlanSubTheme.subThemeId,
            ),
            tags = envActionControlPlanSubTheme.tags,
        )
    }
}

@Embeddable
data class EnvActionsSubThemePk(
    @Column(name = "env_action_id")
    val envActionId: UUID,

    @Column(name = "subtheme_id")
    val subthemeId: Int,
) : Serializable
