package fr.gouv.cacem.monitorenv.infrastructure.database.model

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
    var id: ThemeNatinfPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "themes_id")
    @MapsId("themeId")
    val theme: ThemeModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "natinf_code")
    @MapsId("natinfCode")
    val natinf: NatinfModel,
) {
    @Embeddable
    data class ThemeNatinfPk(
        val themeId: Int,
        val natinfCode: Int?,
    ) : Serializable
}
