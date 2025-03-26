package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import java.time.ZonedDateTime

@Entity
@Table(name = "tags")
data class TagModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    @OneToMany(
        mappedBy = "tag",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference
    var subTags: List<SubTagModel>,
) {
    fun toTagEntity(subTags: List<SubTagEntity>? = null): TagEntity =
        TagEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subTags = subTags ?: this.subTags.map { it.toSubTagEntity() },
        )

    companion object {
        fun fromTagEntity(tagEntity: TagEntity): TagModel {
            val tagModel =
                TagModel(
                    id = tagEntity.id,
                    name = tagEntity.name,
                    startedAt = tagEntity.startedAt,
                    endedAt = tagEntity.endedAt,
                    subTags = listOf(),
                )
            tagModel.subTags = tagEntity.subTags.map { SubTagModel.fromSubTagEntity(it, tagModel) }
            return tagModel
        }
    }

    override fun toString(): String =
        "TagModel(id=$id, name='$name', startedAt=$startedAt, endedAt=$endedAt, subTags=$subTags)"
}
