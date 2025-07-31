package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import jakarta.persistence.*
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import java.time.ZonedDateTime

@Entity
@Table(name = "themes")
data class ThemeModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    val parent: ThemeModel?,
    @OneToMany(
        mappedBy = "parent",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    @Fetch(FetchMode.SUBSELECT)
    var subThemes: List<ThemeModel>,
) {
    fun toThemeEntity(): ThemeEntity =
        ThemeEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subThemes = subThemes.map { it.toThemeEntity() },
        )

    companion object {
        fun fromThemeEntity(
            themeEntity: ThemeEntity,
            parent: ThemeModel? = null,
        ): ThemeModel {
            val tagModel =
                ThemeModel(
                    id = themeEntity.id,
                    name = themeEntity.name,
                    parent = parent,
                    startedAt = themeEntity.startedAt,
                    endedAt = themeEntity.endedAt,
                    subThemes = listOf(),
                )
            tagModel.subThemes = themeEntity.subThemes.map { fromThemeEntity(it, tagModel) }
            return tagModel
        }
    }

    override fun toString(): String = "ThemeModel(id=$id, name='$name', startedAt=$startedAt, endedAt=$endedAt)"

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ThemeModel

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
