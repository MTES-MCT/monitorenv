package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefTargetDetailsEntity
import fr.gouv.cacem.monitorenv.infrastructure.file.reporting.ReportingFlags
import org.apache.poi.util.Units
import org.apache.poi.xwpf.usermodel.Document
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.TableRowHeightRule
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFTable
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STBorder
import org.springframework.stereotype.Component
import java.io.ByteArrayInputStream
import java.math.BigInteger

@Component
class ReportingFile(
    private val reportingFlag: ReportingFlags,
) : BriefFileWriter() {
    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${reportingsDetails}") }?.let { paragraph ->
            createReportingsDetails(paragraph, brief.reportings)
        }
    }

    private fun createReportingsDetails(
        paragraph: XWPFParagraph,
        reportings: List<EditableBriefReportingEntity>,
    ) {
        val document = paragraph.document as XWPFDocument
        if (reportings.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        paragraph.runs.forEach { it.setText("", 0) }

        for (reporting in reportings) {
            val tableParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            table.setWidth("100%")
            setTableBorders(table, "CCCFD6", false)

            var svg = reportingFlag.getReportingFlag(reporting.iconColor)

            if (reporting.isArchived) {
                svg = reportingFlag.getArchivedReportingFlag(reporting.iconColor)
            }
            val imageBytes = convertSvgStringToPngBytes(svg)

            val rowTitle = table.getRow(0)
            rowTitle.height = 300
            rowTitle.heightRule = TableRowHeightRule.EXACT
            val cellTitle = rowTitle.getCell(0)
            cellTitle.removeParagraph(0)

            val paragraphTitle = cellTitle.addParagraph()
            val runWithImage = paragraphTitle.createRun()

            val imageStream = ByteArrayInputStream(imageBytes)
            val pictureType = Document.PICTURE_TYPE_PNG
            val imageFileName = "icon.png"

            runWithImage.addPicture(imageStream, pictureType, imageFileName, Units.toEMU(12.0), Units.toEMU(12.0))

            runWithImage.setText("   ${reporting.reportingId}")
            runWithImage.fontSize = 9
            runWithImage.color = "707785"
            runWithImage.isBold = true
            runWithImage.fontFamily = "Arial"

            setCellColor(cellTitle, "E5E5EB")
            cellTitle.verticalAlignment = XWPFTableCell.XWPFVertAlign.CENTER

            addReportingGeneralInformation(
                table,
                reporting,
            )

            reporting.targetDetails?.forEach { target ->
                addTargetDetailRows(table, target, reporting)
            }
        }

        cleanParagraphPlaceholder(document, paragraph)
    }

    private fun addTargetDetailRows(
        table: XWPFTable,
        target: EditableBriefTargetDetailsEntity,
        reporting: EditableBriefReportingEntity,
    ) {
        val rows: List<List<String>> = target.buildDetailsRows(reporting)

        rows.forEach { rowData ->
            val row = table.createRow()
            row.height = 300
            row.heightRule = TableRowHeightRule.AUTO

            while (row.tableCells.size < rowData.size) {
                row.addNewTableCell()
            }

            rowData.chunked(2).forEachIndexed { index, pair ->
                val label = pair.getOrElse(0) { "" }
                val value = pair.getOrElse(1) { "" }

                val labelCell = row.getCell(index * 2)
                labelCell.text = label
                setCellWidth(labelCell, 1500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "707785")

                val valueCell = row.getCell(index * 2 + 1)
                valueCell.text = value
                setCellWidth(valueCell, 1830)
                styleCell(valueCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            }
        }
    }

    private fun addReportingGeneralInformation(
        table: XWPFTable,
        reporting: EditableBriefReportingEntity,
    ) {
        val row =
            table.createRow().apply {
                height = 300
                heightRule = TableRowHeightRule.AUTO
            }

        while (row.tableCells.size < 6) {
            row.addNewTableCell()
        }

        val detailRows = reporting.buildDetailsRows()

        for ((index, rowData) in detailRows.withIndex()) {
            val labelCell = row.getCell(index * 2)
            configureCell(labelCell, rowData[0], bold = false, color = "707785", width = 1500)

            val valueCell = row.getCell(index * 2 + 1)
            configureCell(valueCell, rowData[1], bold = true, width = 2660)
        }
    }

    private fun configureCell(
        cell: XWPFTableCell,
        text: String,
        bold: Boolean,
        color: String? = null,
        width: Int,
    ) {
        cell.text = text
        setCellWidth(cell, width)
        styleCell(cell, bold = bold, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = color)
        addBottomBorder(cell)
    }

    private fun addBottomBorder(cell: XWPFTableCell) {
        val color = "CCCFD6"
        val tcPr = cell.ctTc.tcPr ?: cell.ctTc.addNewTcPr()
        val borders = tcPr.tcBorders ?: tcPr.addNewTcBorders()

        borders.bottom =
            borders.addNewBottom().apply {
                `val` = STBorder.SINGLE
                sz = BigInteger.valueOf(4)
                this.color = color
            }
    }
}
