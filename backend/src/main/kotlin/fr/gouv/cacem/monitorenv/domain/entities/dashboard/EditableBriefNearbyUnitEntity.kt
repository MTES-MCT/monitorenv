package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.TextAlignment
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

data class EditableBriefNearbyUnitEntity(
    val administration: String,
    val controlUnit: String,
    val maxDate: ZonedDateTime?,
    val minDate: ZonedDateTime?,
    val nbControls: Int,
    val nbInfractions: Int,
    val nbPV: Int,
    val themes: String,
    val status: NearbyUnitMissionStatus,
) : CustomizableCell {
    companion object {
        private const val NAME_ROW_INDEX = 0
        private const val STATUS_ROW_INDEX = 1
        private const val THEME_ROW_INDEX = 2
        private const val NB_CONTROLS_ROW_INDEX = 3
        const val NB_CELLS = 4
    }

    override fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    ) {
        when (rowIndex) {
            NAME_ROW_INDEX -> {
                val paragraph =
                    cell.addParagraph().apply {
                        alignment = ParagraphAlignment.LEFT
                        verticalAlignment = TextAlignment.CENTER
                    }
                paragraph.createRun().apply {
                    setText("$controlUnit ($administration)")
                    fontFamily = "Arial"
                    fontSize = 9
                    isBold = true
                    addBreak()
                    addBreak()
                }
                paragraph.createRun().apply {
                    setText(
                        "Du ${
                            minDate?.format(
                                DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH),
                            )
                        } au ${
                            maxDate?.format(
                                DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH),
                            )
                        }",
                    )
                    fontFamily = "Arial"
                    fontSize = 8
                }
            }

            STATUS_ROW_INDEX -> {
                cell
                    .addParagraph()
                    .apply {
                        alignment = ParagraphAlignment.RIGHT
                        verticalAlignment = TextAlignment.CENTER
                    }.createRun()
                    .apply {
                        fontFamily = "Arial"
                        fontSize = 8
                        isBold = true
                        color =
                            when (status) {
                                NearbyUnitMissionStatus.IN_PROGRESS -> "5697D2"
                                NearbyUnitMissionStatus.FUTURE -> "7CBEF4"
                                NearbyUnitMissionStatus.DONE -> "000000"
                            }
                        setText(status.label)
                    }
            }

            THEME_ROW_INDEX -> {
                cell
                    .addParagraph()
                    .apply {
                        alignment = ParagraphAlignment.LEFT
                        verticalAlignment = TextAlignment.CENTER
                    }.createRun()
                    .apply {
                        fontFamily = "Arial"
                        fontSize = 8
                        isBold = true
                        setText(themes)
                    }
            }

            NB_CONTROLS_ROW_INDEX -> {
                val paragraph =
                    cell.addParagraph().apply {
                        alignment = ParagraphAlignment.RIGHT
                        verticalAlignment = TextAlignment.CENTER
                    }
                paragraph.createRun().apply {
                    setText("$nbControls contrôle${if (nbControls > 1) "s" else ""}")
                    fontFamily = "Arial"
                    fontSize = 8
                    addBreak()
                }
                if (nbInfractions > 0) {
                    paragraph.createRun().apply {
                        fontFamily = "Arial"
                        fontSize = 8
                        isBold = true
                        color = "E1000F"
                        setText("$nbInfractions infraction${if (nbInfractions > 1) "s" else ""}, $nbPV PV")
                    }
                }
            }
        }
    }
}
