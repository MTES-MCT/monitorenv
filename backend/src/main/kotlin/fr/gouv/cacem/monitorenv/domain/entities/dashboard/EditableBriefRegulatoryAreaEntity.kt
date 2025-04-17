package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

data class EditableBriefRegulatoryAreaEntity(
    val id: Int,
    val color: String,
    val entityName: String,
    val facade: String? = null,
    override val image: BriefImageEntity,
    val layerName: String,
    val refReg: String? = null,
    val thematique: String? = null,
    val type: String? = null,
    val url: String? = null,
) : DetailRenderable {
    override val title = layerName

    override fun buildDetailsRows(document: XWPFDocument): List<List<String>> =
        listOf(
            listOf("Entité", entityName),
            listOf("Ensemble reg", type ?: ""),
            listOf("Thématique", thematique ?: ""),
            listOf("Facade", facade ?: ""),
            listOf("Résumé reg.sur Légicem", refReg ?: ""),
        )

    override fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    ) {
        if (rowIndex == 4) {
            while (cell.paragraphs.size > 0) {
                cell.removeParagraph(0)
            }
            WordUtils.addHyperlink(cell, url ?: "", refReg, document)
        }
    }
}
