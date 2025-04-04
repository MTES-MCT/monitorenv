package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class EditableBriefRegulatoryAreaEntity(
    val id: Int,
    val color: String,
    val entityName: String,
    val facade: String? = null,
    val image: BriefImageEntity,
    val layerName: String,
    val refReg: String? = null,
    val thematique: String? = null,
    val type: String? = null,
    val url: String? = null,
)
