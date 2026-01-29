package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.NatinfEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "natinfs")
data class NatinfModel(
    @Id
    @Column(name = "natinf_code")
    val natinfCode: Int,
    @Column(name = "regulation")
    val regulation: String?,
    @Column(name = "infraction_category")
    val infractionCategory: String?,
    @Column(name = "infraction")
    val infraction: String?,
) {
    fun toNatinf() =
        NatinfEntity(
            natinfCode = natinfCode,
            regulation = regulation,
            infractionCategory = infractionCategory,
            infraction = infraction,
        )
}
