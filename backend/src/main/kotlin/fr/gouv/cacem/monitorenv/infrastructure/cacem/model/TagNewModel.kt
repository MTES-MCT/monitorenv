package fr.gouv.cacem.monitorenv.infrastructure.cacem.model

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import jakarta.persistence.*
import java.time.ZonedDateTime

@Entity
@Table(name = "tags")
data class TagNewModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    @ManyToOne
    @JoinColumn(name = "parent_id")
    val parent: TagNewModel?,
    @OneToMany(
        mappedBy = "parent",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    var subTags: List<TagNewModel>,
) {
    fun toTagEntity(): TagEntity =
        TagEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subTags = subTags.map { it.toTagEntity() },
        )

    companion object {
        fun fromTagEntity(
            tagEntity: TagEntity,
            parent: TagNewModel? = null,
        ): TagNewModel {
            val tagModel =
                TagNewModel(
                    id = tagEntity.id,
                    name = tagEntity.name,
                    parent = parent,
                    startedAt = tagEntity.startedAt,
                    endedAt = tagEntity.endedAt,
                    subTags = listOf(),
                )
            tagModel.subTags = tagEntity.subTags.map { fromTagEntity(it, tagModel) }
            return tagModel
        }
    }

    override fun toString(): String = "TagModel(id=$id, name='$name', startedAt=$startedAt, endedAt=$endedAt)"

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as TagNewModel

        if (id != other.id) return false
        if (name != other.name) return false
        if (startedAt != other.startedAt) return false
        if (endedAt != other.endedAt) return false
        if (parent != other.parent) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + name.hashCode()
        result = 31 * result + (startedAt?.hashCode() ?: 0)
        result = 31 * result + (endedAt?.hashCode() ?: 0)
        return result
    }
}
