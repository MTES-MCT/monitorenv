package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import org.hibernate.Hibernate
import java.io.Serializable
import java.util.UUID

@Entity
@Table(name = "env_actions_control_plan_themes")
class EnvActionsControlPlanThemeModel(
    @EmbeddedId
    val id: EnvActionsThemePk,
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("envActionId")
    @JoinColumn(name = "env_action_id")
    val envAction: EnvActionModel? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("themeId")
    @JoinColumn(name = "theme_id")
    val controlPlanTheme: ControlPlanThemeModel? = null,
    @Column(name = "order_index", updatable = false, insertable = false)
    val orderIndex: Int? = null,
) {
    companion object {
        fun fromEnvActionControlPlanThemeEntity(
            envAction: EnvActionModel,
            controlPlanTheme: ControlPlanThemeModel,
        ) = EnvActionsControlPlanThemeModel(
            id =
                EnvActionsThemePk(
                    envActionId = envAction.id,
                    themeId = controlPlanTheme.id,
                ),
            envAction = envAction,
            controlPlanTheme = controlPlanTheme,
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as EnvActionsControlPlanThemeModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}

@Embeddable
data class EnvActionsThemePk(
    @Column(name = "env_action_id")
    val envActionId: UUID?,
    @Column(name = "theme_id")
    val themeId: Int,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is EnvActionsThemePk) return false

        return envActionId == other.envActionId &&
            themeId == other.themeId
    }

    override fun hashCode(): Int = listOf(envActionId, themeId).hashCode()
}
