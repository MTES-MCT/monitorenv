package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "natinfs")
data class NatinfModel(
    @Id
    @Column(name = "natinf_code")
    var natinfCode: Int,
    @Column(name = "regulation")
    var regulation: String?,
    @Column(name = "infraction_category")
    var infractionCategory: String?,
    @Column(name = "infraction")
    var infraction: String?,
) {
    fun toNatinf() = NatinfEntity(
        natinfCode = natinfCode,
        regulation = regulation,
        infractionCategory = infractionCategory,
        infraction = infraction,
    )

    companion object {
        fun fromNatinfEntity(natinf: NatinfEntity) = NatinfModel(
            natinfCode = natinf.natinfCode,
            regulation = natinf.regulation,
            infractionCategory = natinf.infractionCategory,
            infraction = natinf.infraction,
        )
    }
}
