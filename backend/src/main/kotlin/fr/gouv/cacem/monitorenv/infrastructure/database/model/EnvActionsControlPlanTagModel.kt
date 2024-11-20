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
@Table(name = "env_actions_control_plan_tags")
class EnvActionsControlPlanTagModel(
    @EmbeddedId
    val id: EnvActionsTagPk,
    @ManyToOne
    @MapsId("envActionId")
    @JoinColumn(name = "env_action_id")
    val envAction: EnvActionModel? = null,
    @ManyToOne
    @MapsId("tagId")
    @JoinColumn(name = "tag_id")
    val controlPlanTag: ControlPlanTagModel? = null,
    @Column(name = "order_index", updatable = false, insertable = false)
    val orderIndex: Int? = null,
) {
    companion object {
        fun fromEnvActionControlPlanTagEntity(
            envAction: EnvActionModel,
            controlPlanTag: ControlPlanTagModel,
        ) = EnvActionsControlPlanTagModel(
            id =
                EnvActionsTagPk(
                    envActionId = envAction.id,
                    tagId = controlPlanTag.id,
                ),
            envAction = envAction,
            controlPlanTag = controlPlanTag,
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as EnvActionsControlPlanTagModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}

@Embeddable
data class EnvActionsTagPk(
    @Column(name = "env_action_id") val envActionId: UUID,
    @Column(name = "tag_id") val tagId: Int,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is EnvActionsTagPk) return false

        return envActionId == other.envActionId && tagId == other.tagId
    }

    override fun hashCode(): Int {
        return listOf(envActionId, tagId).hashCode()
    }
}
