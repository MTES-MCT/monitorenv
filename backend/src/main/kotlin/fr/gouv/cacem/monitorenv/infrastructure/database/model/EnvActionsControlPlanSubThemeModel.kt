package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import org.hibernate.Hibernate
import java.io.Serializable
import java.util.UUID

@Entity
@Table(name = "env_actions_control_plan_sub_themes")
class EnvActionsControlPlanSubThemeModel(
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
    @Column(name = "order_index", updatable = false, insertable = false)
    val orderIndex: Int? = null,
) {
    companion object {
        fun fromEnvActionControlPlanSubThemeEntity(
            envAction: EnvActionModel,
            controlPlanSubTheme: ControlPlanSubThemeModel,
        ) = EnvActionsControlPlanSubThemeModel(
            id =
                EnvActionsSubThemePk(
                    envActionId = envAction.id,
                    subthemeId = controlPlanSubTheme.id,
                ),
            envAction = envAction,
            controlPlanSubTheme = controlPlanSubTheme,
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as EnvActionsControlPlanSubThemeModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}

@Embeddable
data class EnvActionsSubThemePk(
    @Column(name = "env_action_id") val envActionId: UUID,
    @Column(name = "subtheme_id") val subthemeId: Int,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is EnvActionsSubThemePk) return false

        return envActionId == other.envActionId && subthemeId == other.subthemeId
    }

    override fun hashCode(): Int {
        return listOf(envActionId, subthemeId).hashCode()
    }
}
