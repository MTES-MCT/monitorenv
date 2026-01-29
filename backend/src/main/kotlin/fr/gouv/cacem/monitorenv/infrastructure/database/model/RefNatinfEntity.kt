package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "ref_natinfs")
data class RefNatinfModel(
    @Id
    val id: Int,
    val nature: String?,
    val qualification: String?,
    val definedBy: String?,
    val repressedBy: String?,
) {
    fun toRefNatinfEntity(): RefNatinfEntity =
        RefNatinfEntity(
            id = id,
            nature = nature,
            qualification = qualification,
            definedBy = definedBy,
            repressedBy = repressedBy,
        )

    companion object {
        fun fromRefNatinfEntity(refNatinfEntity: RefNatinfEntity): RefNatinfModel =
            RefNatinfModel(
                id = refNatinfEntity.id,
                nature = refNatinfEntity.nature,
                qualification = refNatinfEntity.qualification,
                definedBy = refNatinfEntity.definedBy,
                repressedBy = refNatinfEntity.repressedBy,
            )
    }
}
