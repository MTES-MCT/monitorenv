package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity
import javax.persistence.*

@Entity
@Table(name = "natinfs")
data class NatinfModel(
    @Id
    @Column(name = "id")
    var id: Int,
    @Column(name = "natinf_code")
    var natinf_code: String,
    @Column(name = "regulation")
    var regulation: String?,
    @Column(name = "infraction_category")
    var infractionCategory: String?,
    @Column(name = "infraction")
    var infraction: String?
) {
    fun toNatinf() = NatinfEntity(
        id = id,
        natinf_code = natinf_code,
        regulation = regulation,
        infractionCategory = infractionCategory,
        infraction = infraction
    )

    companion object {
        fun fromNatinfEntity(natinf: NatinfEntity) = NatinfModel(
            id = natinf.id,
            natinf_code = natinf.natinf_code,
            regulation = natinf.regulation,
            infractionCategory = natinf.infractionCategory,
            infraction = natinf.infraction
        )
    }
}
