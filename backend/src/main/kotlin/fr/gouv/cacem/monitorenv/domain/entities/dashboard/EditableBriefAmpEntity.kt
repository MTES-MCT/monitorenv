package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class EditableBriefAmpEntity(
    val id: Int,
    val color: String,
    val designation: String,
    val image: BriefImageEntity,
    val name: String,
    val refReg: String? = null,
    val type: String? = null,
    val urlLegicem: String? = null,
)
