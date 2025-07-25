package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

data class EditableBriefRegulatoryAreaEntity(
    val id: Int,
    val color: String,
    val entityName: String,
    val facade: String? = null,
    override val image: String?,
    override val minimap: String?,
    val layerName: String,
    val refReg: String? = null,
    val themes: String? = null,
    val type: String? = null,
    val url: String? = null,
) : DetailWithImagesRenderable {
    override val title = layerName

    companion object {
        private const val LINK_ROW_INDEX = 4
    }

    override fun buildDetailsRows(): List<List<String>> =
        listOf(
            listOf("Entité", entityName),
            listOf("Ensemble reg", type ?: ""),
            listOf("Thématique", themes ?: ""),
            listOf("Facade", facade ?: ""),
            listOf("Résumé reg.sur Légicem", refReg ?: ""),
        )

    override fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    ) {
        if (rowIndex == LINK_ROW_INDEX) {
            while (cell.paragraphs.isNotEmpty()) {
                cell.removeParagraph(0)
            }
            WordUtils.addHyperlink(cell, url ?: "", refReg, document)
        }
    }
}
