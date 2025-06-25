package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

data class EditableBriefAmpEntity(
    val id: Int,
    val color: String,
    val designation: String,
    override val image: String?,
    override val minimap: String?,
    val name: String,
    val refReg: String? = null,
    val type: String? = null,
    val urlLegicem: String? = null,
) : DetailWithImagesRenderable {
    override val title = name

    override fun buildDetailsRows(): List<List<String>> =
        listOf(
            listOf("Nature d'AMP", designation),
            listOf("Résumé reg.sur Légicem", urlLegicem ?: ""),
        )

    override fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    ) {
        if (rowIndex == 1) {
            while (cell.paragraphs.isNotEmpty()) {
                cell.removeParagraph(0)
            }
            WordUtils.addHyperlink(cell, urlLegicem ?: "", refReg, document)
        }
    }
}
