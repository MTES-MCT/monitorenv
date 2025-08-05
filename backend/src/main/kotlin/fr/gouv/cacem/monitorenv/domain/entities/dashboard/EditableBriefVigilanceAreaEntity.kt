package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

data class EditableBriefVigilanceAreaEntity(
    val color: String,
    val comments: String? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingOccurenceDate: String,
    val frequency: String,
    val id: Int,
    val isAtAllTimes: Boolean,
    override val image: String?,
    val imagesAttachments: List<ImageEntity>? = null,
    override val minimap: String?,
    val linkedAMPs: String? = null,
    val linkedRegulatoryAreas: String? = null,
    val links: List<LinkEntity>? = null,
    val name: String,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: String? = null,
    val visibility: String? = null,
) : DetailWithImagesRenderable {
    override val title = name

    companion object {
        private const val DATE_ROW_INDEX = 0
        private const val LINK_ROW_INDEX = 6
    }

    override fun buildDetailsRows(): List<List<String>> {
        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH)
        val periodDate = "Du ${startDatePeriod?.format(formatter)} au ${endDatePeriod?.format(formatter)}"

        return listOf(
            listOf("Période", if (isAtAllTimes) "En tout temps" else periodDate),
            listOf("Thématique", themes ?: ""),
            listOf("Visibilité", visibility ?: ""),
            listOf("Commentaires", comments ?: ""),
            listOf("Réglementations en lien", linkedRegulatoryAreas ?: ""),
            listOf("Amps en lien", linkedAMPs ?: ""),
            listOf("Liens utiles", ""),
        )
    }

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
                cellRun.setText(buildDetailsRows()[0][1])
                cellRun.addBreak()
                cellRun.setText(frequency)
                cellRun.addBreak()
                cellRun.setText(endingOccurenceDate)
            }

            LINK_ROW_INDEX -> {
                links?.forEach {
                    WordUtils.addHyperlink(cell, it.linkUrl, it.linkText, document)
                }
            }
        }
    }
}
