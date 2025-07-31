package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import jakarta.persistence.*
import java.io.Serializable
import java.util.*

@Entity
@Table(name = "tags_env_actions")
data class TagEnvActionModel(
    @EmbeddedId
    var id: TagEnvActionPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tags_id")
    @MapsId("tagId")
    val tag: TagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "env_actions_id")
    @MapsId("envActionId")
    @JsonBackReference
    val envAction: EnvActionModel,
) {
    companion object {
        fun fromTagEntity(
            tag: TagEntity,
            envAction: EnvActionModel,
        ): TagEnvActionModel =
            TagEnvActionModel(
                id = TagEnvActionPk(tag.id, envAction.id),
                tag = TagModel.fromTagEntity(tag),
                envAction = envAction,
            )

        fun fromTagEntities(
            tags: List<TagEntity>,
            envAction: EnvActionModel,
        ): List<TagEnvActionModel> =
            tags
                .map { theme -> fromTagEntity(theme, envAction) }
                .plus(
                    tags.flatMap { theme ->
                        theme.subTags.map { subTag ->
                            fromTagEntity(subTag, envAction)
                        }
                    },
                )

        fun toTagEntities(tags: List<TagEnvActionModel>): List<TagEntity> {
            val parents = tags.map { it.tag }.filter { it.parent === null }

            return parents.map { parent ->
                val subTags = tags.filter { it.tag.parent?.id == parent.id }.map { it.tag }
                parent.subTags = subTags
                return@map parent.toTagEntity()
            }
        }
    }
}

@Embeddable
data class TagEnvActionPk(
    val tagId: Int,
    val envActionId: UUID,
) : Serializable
