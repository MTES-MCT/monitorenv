package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.ZonedDateTime

@Entity
@Table(name = "sub_tags")
data class SubTagModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tags_id")
    @JsonBackReference
    val tag: TagModel,
) {
    fun toSubTagEntity(): SubTagEntity = SubTagEntity(id = id, name = name, startedAt = startedAt, endedAt = endedAt)

    companion object {
        fun fromSubTagEntity(
            subTagEntity: SubTagEntity,
            theme: TagModel,
        ): SubTagModel =
            SubTagModel(
                id = subTagEntity.id,
                name = subTagEntity.name,
                startedAt = subTagEntity.startedAt,
                endedAt = subTagEntity.endedAt,
                tag = theme,
            )
    }

    override fun toString(): String = "SubThemeModel(endedAt=$endedAt, startedAt=$startedAt, name='$name', id=$id)"
}
