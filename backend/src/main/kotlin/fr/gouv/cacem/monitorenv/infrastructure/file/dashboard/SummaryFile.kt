package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefAmpEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefVigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.MissionStatus
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.apache.poi.xwpf.usermodel.BreakType
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.TableRowHeightRule
import org.apache.poi.xwpf.usermodel.TableWidthType
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFRun
import org.apache.poi.xwpf.usermodel.XWPFTable
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import org.apache.poi.xwpf.usermodel.XWPFTableRow
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge
import org.springframework.stereotype.Component
import java.time.format.DateTimeFormatter
import java.util.Locale

@Component
class SummaryFile(
    private val controlUnitRepository: IControlUnitRepository,
    private val legicemProperties: LegicemProperties,
    private val monitorExtProperties: MonitorExtProperties,
) : BriefFileWriter() {
    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    ) {
        val controlUnits = controlUnitRepository.findAllById(brief.dashboard.controlUnitIds)
        val controlUnitsName =
            if (controlUnits.isNotEmpty()) {
                controlUnits.joinToString(
                    ", ",
                ) { it.name }
            } else {
                "Aucune unité sélectionnée"
            }

        val placeholders = buildPlaceholders(brief, controlUnitsName)
        applyParagraphReplacements(document, placeholders)
        applyCustomTableInsertions(document, brief)
        applyGlobalMapInsertion(document, brief)
    }

    /******* DATA INSERTION *******/
    private fun buildPlaceholders(
        brief: BriefEntity,
        controlUnitsName: String,
    ): Map<String, String?> {
        val dashboard = brief.dashboard
        val datePattern = "dd/MM/yyyy"
        val formatter = DateTimeFormatter.ofPattern(datePattern, Locale.FRENCH)
        val formattedDate = (dashboard.updatedAt ?: dashboard.createdAt)?.format(formatter)

        fun buildCountText(
            label: String,
            count: Int,
            feminine: Boolean,
        ) = if (count >
            0
        ) {
            "$count $label"
        } else if (feminine) {
            "Aucune ${label.lowercase()}"
        } else {
            "Aucun ${label.lowercase()}"
        }

        val regulatoryCount = dashboard.regulatoryAreaIds.size
        val ampCount = dashboard.ampIds.size
        val vigilanceCount = dashboard.vigilanceAreaIds.size
        val reportingCount = dashboard.reportingIds.size
        val totalZones = regulatoryCount + ampCount + vigilanceCount
        val hasRecentlyNearbyUnits = brief.nearbyUnits.any { it.status === MissionStatus.DONE }
        val nearbyUnitsMinDateRange =
            brief.nearbyUnits
                .filter { it.status == MissionStatus.DONE }
                .mapNotNull { it.minDate }
                .minOrNull()
                ?.format(
                    DateTimeFormatter.ofPattern(
                        datePattern,
                        Locale.FRENCH,
                    ),
                )
        val nearbyUnitsMaxDateRange =
            brief.nearbyUnits
                .filter { it.status == MissionStatus.DONE }
                .mapNotNull { it.maxDate }
                .maxOrNull()
                ?.format(
                    DateTimeFormatter.ofPattern(
                        datePattern,
                        Locale.FRENCH,
                    ),
                )

        return mapOf(
            "\${editedAt}" to formattedDate,
            "\${briefName}" to dashboard.name,
            "\${comments}" to (dashboard.comments ?: "Aucun commentaire"),
            "\${controlUnits}" to controlUnitsName,
            "\${totalRegulatoryAreasText}" to buildCountText("zones réglementaires", regulatoryCount, true),
            "\${totalRegulatoryAreas}" to regulatoryCount.toString(),
            "\${totalAmpsText}" to buildCountText("aires marines protégées", ampCount, true),
            "\${totalAmps}" to ampCount.toString(),
            "\${totalVigilanceAreasText}" to buildCountText("zones de vigilance", vigilanceCount, true),
            "\${totalVigilanceAreas}" to vigilanceCount.toString(),
            "\${totalReportingsText}" to buildCountText("signalements", reportingCount, false),
            "\${totalReportings}" to reportingCount.toString(),
            "\${totalZones}" to totalZones.toString(),
            "\${legicemId}" to legicemProperties.id,
            "\${legicemPassword}" to legicemProperties.password,
            "\${monitorExtId}" to monitorExtProperties.id,
            "\${monitorExtPassword}" to monitorExtProperties.password,
            "\${recentActivityPeriod}" to "Du ${
                brief.recentActivity.startAfter?.format(
                    DateTimeFormatter.ofPattern(
                        datePattern,
                        Locale.FRENCH,
                    ),
                )
            } au ${
                brief.recentActivity.startBefore?.format(
                    DateTimeFormatter.ofPattern(
                        datePattern,
                        Locale.FRENCH,
                    ),
                )
            }" + if (brief.recentActivity.period.isEmpty()) "" else " - ${brief.recentActivity.period}",
            "\${nearbyUnitsDateRange}" to
                if (hasRecentlyNearbyUnits) "Du $nearbyUnitsMinDateRange au $nearbyUnitsMaxDateRange" else "",
        )
    }

    private fun applyGlobalMapInsertion(
        document: XWPFDocument,
        brief: BriefEntity,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${globalMap}") }?.let { paragraph ->
            createImageFromBase64("global_map", brief.image, paragraph)
            paragraph.runs.forEach { it.setText("", 0) }
        }
    }

    private fun applyParagraphReplacements(
        document: XWPFDocument,
        placeholders: Map<String, String?>,
    ) {
        document.paragraphs.forEach { paragraph ->
            replacePlaceholdersInParagraph(paragraph, placeholders)
        }
        document.tables.forEach { _ ->
            replacePlaceholdersInTables(document, placeholders)
        }
    }

    private fun applyCustomTableInsertions(
        document: XWPFDocument,
        brief: BriefEntity,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${regulatoryAreasTable}") }?.let {
            createRegulatoryTable(it, brief.regulatoryAreas)
        }

        document.paragraphs.firstOrNull { it.text.contains("\${ampsAndVigilanceAreasTables}") }?.let {
            createSideBySideTables(it, brief.vigilanceAreas, brief.amps)
        }
    }

    private fun createRegulatoryTable(
        paragraph: XWPFParagraph,
        regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    ) {
        val document = paragraph.document as XWPFDocument
        if (regulatoryAreas.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")

        val totalRegulatoryAreas = regulatoryAreas.size

        val headerRow = table.getRow(0) ?: table.createRow()
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.text = "Zones réglementaires - $totalRegulatoryAreas sélectionnée(s)"
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "FFFFFF")
        mergeCellsHorizontally(table)
        setCellColor(headerCell, "8CC3C0")

        // Grouped by `layerName`
        val groupedByLayer = regulatoryAreas.groupBy { it.layerName }

        for ((layerName, areas) in groupedByLayer) {
            val firstRowIndex = table.numberOfRows
            val layerCellCreated = mutableMapOf<Int, XWPFTableCell>()

            for ((index, area) in areas.withIndex()) {
                val row = table.createRow()

                val nameCell = row.getCell(0)
                if (index == 0) {
                    nameCell.text = layerName
                    styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
                    layerCellCreated[firstRowIndex] = row.getCell(0)
                } else {
                    row.getCell(0).text = ""
                }
                setCellWidth(nameCell, 3000)

                val colorCell = row.getCell(1)
                rgbaStringToHex(area.color)?.let { setCellColor(colorCell, it) }
                setCellWidth(colorCell, 250)
                styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val entityCell = row.getCell(2) ?: row.createCell()
                entityCell.text = area.entityName
                setCellWidth(entityCell, 6750)
                styleCell(entityCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            }

            if (areas.size > 1) {
                mergeVerticalCells(table, firstRowIndex, areas.size)
            }
            setTableBorders(table, "D4E5F4")
        }

        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createAmpsTable(
        paragraph: XWPFParagraph,
        amps: List<EditableBriefAmpEntity>,
    ) {
        createSimpleTable(
            paragraph,
            amps,
            title = "Aires Marines Protégées",
            headerColor = "D6DF64",
        ) { row, amp ->
            val colorCell = row.getCell(0) ?: row.createCell()
            rgbaStringToHex(amp.color)?.let { setCellColor(colorCell, it) }
            setCellWidth(colorCell, 250)
            styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

            val nameCell = row.getCell(1) ?: row.createCell()
            nameCell.text = "${amp.name} / ${amp.type}"
            setCellWidth(nameCell, 4750)
            styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
        }
    }

    private fun createVigilanceAreasTable(
        paragraph: XWPFParagraph,
        vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
    ) {
        createSimpleTable(
            paragraph,
            vigilanceAreas,
            title = "Zones de vigilance",
            headerColor = "C58F7E",
            headerTextColor = "FFFFFF",
        ) { row, area ->
            val colorCell = row.getCell(0) ?: row.createCell()
            rgbaStringToHex(area.color)?.let { setCellColor(colorCell, it) }
            setCellWidth(colorCell, 250)
            styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

            val nameCell = row.getCell(1) ?: row.createCell()
            nameCell.text = area.name
            setCellWidth(nameCell, 4750)
            styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
        }
    }

    private fun createSideBySideTables(
        paragraph: XWPFParagraph,
        vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
        amps: List<EditableBriefAmpEntity>,
    ) {
        val document = paragraph.document as XWPFDocument
        if (vigilanceAreas.isEmpty() && amps.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        val parentTable = document.insertNewTbl(paragraph.ctp.newCursor())
        parentTable.width = 10000
        parentTable.widthType = TableWidthType.DXA
        setTableBorders(parentTable, "FFFFFF")

        val row = parentTable.createRow()
        val cell1 = row.getCell(0) ?: row.createCell()
        val cell2 = row.getCell(1) ?: row.createCell()

        row.apply {
            height = 300
            heightRule = TableRowHeightRule.AUTO
        }

        setCellWidth(cell1, 5000)
        setCellWidth(cell2, 5000)

        if (vigilanceAreas.isNotEmpty()) {
            cell1.removeParagraph(0)
            createVigilanceAreasTable(cell1.addParagraph(), vigilanceAreas)
        }
        if (amps.isNotEmpty()) {
            cell2.removeParagraph(0)
            createAmpsTable(cell2.addParagraph(), amps)
        }

        deleteFirstEmptyLineInTable(parentTable)

        cleanParagraphPlaceholder(document, paragraph)

        val pageBreakParagraph = document.createParagraph()
        pageBreakParagraph.createRun().addBreak(BreakType.PAGE)
    }

    private fun replacePlaceholdersInParagraph(
        paragraph: XWPFParagraph,
        placeholders: Map<String, String?>,
    ) {
        paragraph.runs.forEach { run ->
            val originalText = run.text() ?: return@forEach
            val newText = replacePlaceholdersInText(originalText, placeholders, run)
            run.setText(newText, 0)
        }
    }

    private fun replacePlaceholdersInText(
        text: String,
        placeholders: Map<String, String?>,
        run: XWPFRun,
    ): String {
        var updatedText = text
        placeholders.forEach { (placeholder, value) ->
            if (updatedText.contains(placeholder)) {
                updatedText = updatedText.replace(placeholder, value ?: "")
                applyStyleIfNoInfo(value, run)
            }
        }
        return updatedText
    }

    private fun replacePlaceholdersInTables(
        document: XWPFDocument,
        placeholders: Map<String, String?>,
    ) {
        document.tables.forEach { table ->
            table.rows.forEach { row ->
                row.tableCells.forEach { cell ->
                    processCell(cell, placeholders)
                }
            }
        }
    }

    private fun processCell(
        cell: XWPFTableCell,
        placeholders: Map<String, String?>,
    ) {
        cell.paragraphs.forEach { paragraph ->
            if (containsSpecialPlaceholders(paragraph.text)) {
                styleCell(cell, bold = false, fontSize = 9, alignment = ParagraphAlignment.RIGHT)
            }
            replacePlaceholdersInParagraph(paragraph, placeholders)
        }
    }

    private fun mergeCellsHorizontally(table: XWPFTable) {
        val row = 0
        val fromCol = 0
        val toCol = 2
        val tableRow = table.getRow(row) ?: return

        // Create cells if they don't exist
        for (i in fromCol..toCol) {
            if (tableRow.getCell(i) == null) {
                tableRow.createCell()
            }
        }

        // Merge the cells
        val firstCell = tableRow.getCell(fromCol)
        firstCell
            .ctTc
            .addNewTcPr()
            .addNewHMerge()
            .`val` = STMerge.RESTART
        for (col in fromCol + 1..toCol) {
            tableRow
                .getCell(col)
                .ctTc
                .addNewTcPr()
                .addNewHMerge()
                .`val` = STMerge.CONTINUE
        }
    }

    private fun mergeVerticalCells(
        table: XWPFTable,
        startRow: Int,
        rowCount: Int,
    ) {
        val colIndex = 0
        for (i in 0 until rowCount) {
            val row = table.getRow(startRow + i)
            val cell = row.getCell(colIndex)

            if (cell != null) {
                val tcPr = cell.ctTc.addNewTcPr()
                val vMerge = tcPr.addNewVMerge()

                if (i == 0) {
                    vMerge.`val` = STMerge.RESTART
                } else {
                    vMerge.`val` = STMerge.CONTINUE
                    cell.setText("")
                }
            }
        }
    }

    /******* UTILS *******/
    private fun <T> createSimpleTable(
        paragraph: XWPFParagraph,
        data: List<T>,
        title: String,
        headerColor: String,
        headerTextColor: String? = null,
        cellBuilder: (XWPFTableRow, T) -> Unit,
    ) {
        val document = paragraph.document as XWPFDocument
        if (data.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")
        setTableBorders(table, "D4E5F4")

        val headerRow = table.getRow(0) ?: table.createRow()
        headerRow.apply {
            height = 300
            setHeightRule(TableRowHeightRule.AUTO)
        }
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("$title - ${data.size} sélectionnée(s)")
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = headerTextColor)
        setCellColor(headerCell, headerColor)

        for (item in data) {
            val row = table.createRow()
            cellBuilder(row, item)
        }

        val run = paragraph.createRun()
        run.addBreak()
    }

    private fun applyStyleIfNoInfo(
        value: String?,
        run: XWPFRun,
    ) {
        if (value?.contains("Aucune") == true || value?.contains("Aucun") == true) {
            run.isItalic = true
            run.isBold = false
        }
    }

    private fun rgbaStringToHex(rgba: String): String? {
        val regex = """rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)""".toRegex()
        val matchResult = regex.find(rgba) ?: return null

        val (r, g, b) = matchResult.destructured

        return String.format("%02X%02X%02X", r.toInt(), g.toInt(), b.toInt())
    }

    private fun containsSpecialPlaceholders(text: String): Boolean =
        text.contains("\${briefName}") || text.contains("\${editedAt}")
}
