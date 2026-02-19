package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "themes_natinfs")
data class ThemeNatinfModel(
    @EmbeddedId
    val id: ThemeNatinfPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ref_natinfs_id")
    @MapsId("refNatinfId")
    val refNatinf: RefNatinfModel,
) {
    companion object {
        fun toThemeEntities(themes: List<ThemeNatinfModel>): List<ThemeEntity> {
            val parents = themes.map { it.theme }.filter { it.parent === null }

            return parents.map { parent ->
                val subThemes = themes.filter { it.theme.parent?.id == parent.id }.map { it.theme }
                parent.subThemes = subThemes
                return@map parent.toThemeEntity()
            }
        }

        fun toNatinfEntity(
            themesNatinfs: List<ThemeNatinfModel>,
            refNatinf: RefNatinfModel,
        ): NatinfEntity {
            val themes = toThemeEntities(themesNatinfs)
            return NatinfEntity(refNatinf = refNatinf.toRefNatinfEntity(), themes = themes)
        }
    }

    @Embeddable
    data class ThemeNatinfPk(
        val themeId: Int,
        val refNatinfId: Int,
    ) : Serializable
}
