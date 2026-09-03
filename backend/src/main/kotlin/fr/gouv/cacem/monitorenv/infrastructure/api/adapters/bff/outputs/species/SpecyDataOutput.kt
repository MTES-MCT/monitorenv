package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.species

import fr.gouv.cacem.monitorenv.domain.entities.species.SpecyEntity

class SpecyDataOutput(
    val id: Int,
    val code: String,
    val name: String,
) {
    companion object {
        fun fromSpecyEntity(specy: SpecyEntity): SpecyDataOutput =
            SpecyDataOutput(id = specy.id, code = specy.code, name = specy.name)
    }
}
