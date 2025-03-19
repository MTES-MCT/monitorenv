package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.themes.SubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
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
@Table(name = "themes")
data class ThemeModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    @OneToMany(
        mappedBy = "theme",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference
    var subThemes: List<SubThemeModel>,
) {
    fun toThemeEntity(subThemes: List<SubThemeEntity>? = null): ThemeEntity =
        ThemeEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subThemes = subThemes ?: this.subThemes.map { it.toSubThemeEntity() },
        )

    companion object {
        fun fromThemeEntity(themeEntity: ThemeEntity): ThemeModel {
            val themeModel =
                ThemeModel(
                    id = themeEntity.id,
                    name = themeEntity.name,
                    startedAt = themeEntity.startedAt,
                    endedAt = themeEntity.endedAt,
                    subThemes = listOf(),
                )
            themeModel.subThemes = themeEntity.subThemes.map { SubThemeModel.fromSubThemeEntity(it, themeModel) }
            return themeModel
        }
    }

    override fun toString(): String =
        "ThemeModel(id=$id, name='$name', startedAt=$startedAt, endedAt=$endedAt, subThemes=$subThemes)"
}
