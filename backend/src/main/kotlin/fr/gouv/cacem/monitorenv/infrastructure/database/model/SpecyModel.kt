package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.species.SpecyEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "species")
data class SpecyModel(
    @Id
    @Column(name = "id")
    val id: Int,
    @Column(name = "species_code")
    val code: String,
    @Column(name = "species_name")
    val name: String,
    @Column(name = "scip_species_type")
    val scipSpeciesType: String?,
) {
    fun toSpecyEntity() =
        SpecyEntity(
            id = id,
            code = code,
            name = name,
        )
}
