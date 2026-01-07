package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

data class EditableBriefVigilanceAreaEntity(
    val color: String,
    val comments: String? = null,
    val id: Int,
    override val image: String?,
    val imagesAttachments: List<ImageEntity>? = null,
    override val minimap: String?,
    val linkedAMPs: String? = null,
    val linkedRegulatoryAreas: String? = null,
    val links: List<LinkEntity>? = null,
    val name: String,
    val themes: String? = null,
    val visibility: String? = null,
    val periods: List<EditableBriefVigilanceAreaPeriodEntity>? = null,
) : DetailWithImagesRenderable {
    override val title = name

    companion object {
        private const val DATE_ROW_INDEX = 0
        private const val LINK_ROW_INDEX = 6
    }

    override fun buildDetailsRows(): List<List<String>> =
        listOf(
            listOf(
                "Période(s)",
                periods?.joinToString("\n") { period ->
                    listOf(
                        period.getPeriodText(),
                        period.frequency,
                        period.endingOccurenceDate,
                    ).filter { it.isNotEmpty() }.joinToString(", ")
                }
                    ?: "",
            ),
            listOf("Thématique", themes ?: ""),
            listOf("Visibilité", visibility ?: ""),
            listOf("Commentaires", comments ?: ""),
            listOf("Réglementations en lien", linkedRegulatoryAreas ?: ""),
            listOf("Amps en lien", linkedAMPs ?: ""),
            listOf("Liens utiles", ""),
        )

    override fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    ) {
        when (rowIndex) {
            DATE_ROW_INDEX -> {
                val paragraphs = cell.paragraphs.toList()
                paragraphs.forEach { _ -> cell.removeParagraph(0) }

                val cellRun = cell.addParagraph().createRun()
                cellRun.fontFamily = "Arial"
                cellRun.fontSize = 10
                val periodsText = buildDetailsRows()[0][1]
                val lines = periodsText.split("\n")
                lines.forEachIndexed { index, period ->
                    cellRun.setText(period)
                    if (index < lines.size - 1) {
                        cellRun.addBreak()
                    }
                }
            }

            LINK_ROW_INDEX -> {
                links?.forEach {
                    WordUtils.addHyperlink(cell, it.linkUrl, it.linkText, document)
                }
            }
        }
    }
}
