package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.config.EditableBriefProperties
import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.*
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.file.dashboard.IDashboardFile
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException
import fr.gouv.cacem.monitorenv.infrastructure.file.reporting.ReportingFlags
import fr.gouv.cacem.monitorenv.utils.Base64Converter
import fr.gouv.cacem.monitorenv.utils.OfficeConverter
import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.batik.transcoder.TranscoderInput
import org.apache.batik.transcoder.TranscoderOutput
import org.apache.batik.transcoder.image.PNGTranscoder
import org.apache.poi.util.Units
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy
import org.apache.poi.xwpf.usermodel.*
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STBorder
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.awt.image.BufferedImage
import java.io.*
import java.math.BigInteger
import java.time.format.DateTimeFormatter
import java.util.*
import javax.imageio.ImageIO

@Component
class DashboardFile(
    private val controlUnitRepository: IControlUnitRepository,
    private val editableBriefProperties: EditableBriefProperties,
    private val legicemProperties: LegicemProperties,
    private val monitorExtProperties: MonitorExtProperties,
    private val reportingFlag: ReportingFlags,
) : IDashboardFile {
    private val logger = LoggerFactory.getLogger(DashboardFile::class.java)

    override fun createEditableBrief(brief: BriefEntity): BriefFileEntity {
        val dashboard = brief.dashboard
        logger.info("Creating editable brief for dashboard: ${dashboard.name}")
        try {
            val controlUnits = dashboard.controlUnitIds.map { controlUnitRepository.findById(it) }
            val controlUnitsName =
                if (controlUnits.isNotEmpty()) {
                    controlUnits.joinToString(
                        ", ",
                    ) { it.name }
                } else {
                    "Aucune unité sélectionnée"
                }

            val placeholders = buildPlaceholders(brief, controlUnitsName)
            val document = XWPFDocument(loadTemplateInputStream())
            logger.info("Editable brief document: $document")
            applyParagraphReplacements(document, placeholders)
            logger.info("applyParagraphReplacements done")
            applyCustomTableInsertions(document, brief)
            logger.info("applyCustomTableInsertions done")
            applyGlobalMapInsertion(document, brief)
            logger.info("applyGlobalMapInsertion done")
            applyDetailSections(document, brief)
            logger.info("applyDetailSections done")
            applyLinks(document, brief.dashboard.links)
            logger.info("applyLinks done")
            applyDashboardImages(document, brief.dashboard.images)
            logger.info("applyDashboardImages done")

            addPageNumbersFooter(document)
            setFontForAllParagraphs(document)
            try {
                val tempFile = saveDocument(document)
                logger.info("Editable brief saved to temporary file: $tempFile")
                val odtFile =
                    OfficeConverter().convert(editableBriefProperties.tmpDocxPath, editableBriefProperties.tmpOdtPath)
                logger.info("Editable brief saved to odtFile: $odtFile")
                val base64Content = Base64Converter().convertToBase64(odtFile)
                logger.info("Editable brief saved to base64Content: $base64Content")
                tempFile.delete()
                logger.info("tempFiler deleted")
                println("base64Content $base64Content")
                return BriefFileEntity(
                    fileName = "Brief-${brief.dashboard.name}.odt",
                    fileContent = base64Content,
                )
            } catch (e: Exception) {
                logger.error("Error creating editable brief for dashboard: ${dashboard.name}", e)
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    ("Failed to create editable brief error: ${e.message}"),
                )
            }
        } catch (e: Exception) {
            logger.error("Error creating editable brief for dashboard: ${dashboard.name}", e)
            throw BackendRequestException(
                BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                ("Global Try/catch: ${e.message}"),
            )
        }
    }

    /******* DATA INSERTION *******/
    private fun buildPlaceholders(
        brief: BriefEntity,
        controlUnitsName: String,
    ): Map<String, String?> {
        val dashboard = brief.dashboard
        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH)
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

        return mapOf(
            "\${editedAt}" to formattedDate,
            "\${briefName}" to dashboard.name,
            "\${comments}" to (dashboard.comments ?: "Aucun commentaire"),
            "\${controlUnits}" to controlUnitsName,
            "\${totalRegulatoryAreasText}" to buildCountText("zones règlementaires", regulatoryCount, true),
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
        )
    }

    private fun applyGlobalMapInsertion(
        document: XWPFDocument,
        brief: BriefEntity,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${globalMap}") }?.let { paragraph ->
            createImageFromBase64("global_map", brief.image?.image ?: "", paragraph)
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
            createRegulatoryTable(it, brief.regulatoryAreas ?: emptyList())
        }

        document.paragraphs.firstOrNull { it.text.contains("\${ampsAndVigilanceAreasTables}") }?.let {
            createSideBySideTables(it, brief.vigilanceAreas ?: emptyList(), brief.amps ?: emptyList())
        }
    }

    private fun applyDetailSections(
        document: XWPFDocument,
        brief: BriefEntity,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${regulatoryAreasDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.regulatoryAreas ?: emptyList())
        }

        document.paragraphs.firstOrNull { it.text.contains("\${ampsDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.amps ?: emptyList())
        }

        document.paragraphs.firstOrNull { it.text.contains("\${vigilanceAreasDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.vigilanceAreas ?: emptyList())
        }

        document.paragraphs.firstOrNull { it.text.contains("\${reportingsDetails}") }?.let { paragraph ->
            createReportingsDetails(paragraph, brief.reportings ?: emptyList())
        }
    }

    private fun applyLinks(
        document: XWPFDocument,
        links: List<LinkEntity>?,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${links}") }?.let { paragraph ->
            paragraph.runs.forEach { it.setText("", 0) }
            links?.forEach { link ->
                WordUtils.addHyperlink(null, link.linkUrl, link.linkText, document, paragraph)
                paragraph.createRun().addBreak()
            }
        }
    }

    private fun applyDashboardImages(
        document: XWPFDocument,
        images: List<ImageEntity>,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${images}") }?.let { paragraph ->
            paragraph.runs.forEach { it.setText("", 0) }
            images.forEach { image ->
                createImageFromByteArray(image, document)
                paragraph.createRun().addBreak()
            }
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
        headerCell.setText("Zones règlementaires - $totalRegulatoryAreas sélectionnée(s)")
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
                    nameCell.setText(layerName)
                    styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
                    layerCellCreated[firstRowIndex] = row.getCell(0)
                } else {
                    row.getCell(0).setText("")
                }
                setCellWidth(nameCell, 3000)

                val colorCell = row.getCell(1)
                rgbaStringToHex(area.color)?.let { setCellColor(colorCell, it) }
                setCellWidth(colorCell, 250)
                styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val entityCell = row.getCell(2) ?: row.createCell()
                entityCell.setText(area.entityName)
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
            nameCell.setText("${amp.name} / ${amp.type}")
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
            nameCell.setText(area.name)
            setCellWidth(nameCell, 4750)
            styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
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
            rowTitle.setHeightRule(TableRowHeightRule.EXACT)
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
            cellTitle.setVerticalAlignment(XWPFTableCell.XWPFVertAlign.CENTER)

            addReportingGeneralInformations(
                table,
                reporting,
            )

            reporting.targetDetails?.forEach { target ->
                addTargetDetailRows(table, target, reporting)
            }
        }

        cleanParagraphPlaceholder(document, paragraph)

        val pageBreakParagraph = document.createParagraph()
        pageBreakParagraph.createRun().addBreak(BreakType.PAGE)
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
        parentTable.setWidth(10000)
        parentTable.widthType = TableWidthType.DXA
        setTableBorders(parentTable, "FFFFFF")

        val row = parentTable.createRow()
        val cell1 = row.getCell(0) ?: row.createCell()
        val cell2 = row.getCell(1) ?: row.createCell()

        row.apply {
            height = 300
            setHeightRule(TableRowHeightRule.AUTO)
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

    private fun <T : DetailRenderable> createDetailsSection(
        paragraph: XWPFParagraph,
        items: List<T>,
    ) {
        val document = paragraph.document as XWPFDocument
        if (items.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        for (item in items) {
            val itemParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            createLayerTitle(item.title, itemParagraph, document)

            val newParagraph = document.insertNewParagraph(itemParagraph.ctp.newCursor())
            val imageParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())

            createImageFromBase64(
                name = item.title,
                image = item.image.image,
                paragraph = imageParagraph,
            )

            val tableParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            setTableBorders(table, "D4E5F4")
            table.setWidth("100%")

            val rows = item.buildDetailsRows(document)

            for ((index, rowData) in rows.withIndex()) {
                val row = table.createRow()

                val labelCell = row.getCell(0) ?: row.createCell()
                labelCell.setText(rowData[0])
                setCellWidth(labelCell, 2500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val valueCell = row.getCell(1) ?: row.createCell()
                valueCell.setText(rowData[1])
                item.customizeValueCell(index, valueCell, document)

                setCellWidth(valueCell, 7500)
                styleCell(valueCell, bold = false, fontSize = 9, alignment = ParagraphAlignment.LEFT)
            }

            deleteFirstEmptyLineInTable(table)

            // Add page break
            tableParagraph.createRun().addBreak(BreakType.PAGE)
        }
        cleanParagraphPlaceholder(document, paragraph)

        val pageBreakParagraph = document.createParagraph()
        pageBreakParagraph.createRun().addBreak(BreakType.PAGE)
    }

    private fun addTargetDetailRows(
        table: XWPFTable,
        target: EditableBriefTargetDetailsEntity,
        reporting: EditableBriefReportingEntity,
    ) {
        val targetLabel = "Type de cible"
        val rows: List<List<String>> =
            when (reporting.targetType) {
                TargetTypeEnum.INDIVIDUAL ->
                    listOf(
                        listOf(
                            targetLabel,
                            "Personne physique",
                            "Identité de la personne",
                            target.operatorName ?: "",
                            "",
                            "",
                        ),
                    )

                TargetTypeEnum.COMPANY ->
                    listOf(
                        listOf(
                            targetLabel,
                            "Personne morale",
                            "Nom de la personne morale",
                            target.operatorName ?: "",
                            "Identité de la personne contrôlée",
                            target.vesselName ?: "",
                        ),
                    )

                TargetTypeEnum.OTHER ->
                    listOf(
                        listOf(targetLabel, "Autre", "", "", "", ""),
                    )

                else -> {
                    if (reporting.vehicleType != VehicleTypeEnum.VESSEL) {
                        listOf(
                            listOf(
                                targetLabel,
                                "Véhicule",
                                "Immatriculation",
                                target.externalReferenceNumber ?: "",
                                "Identité de la personne contrôlée",
                                target.operatorName ?: "",
                            ),
                            listOf(
                                "Type de véhicule",
                                translateVehicleType(reporting.vehicleType),
                                "",
                                "",
                                "",
                                "",
                            ),
                        )
                    } else {
                        listOf(
                            listOf(
                                targetLabel,
                                "Véhicule",
                                "Nom du navire",
                                target.vesselName ?: "",
                                "Immatriculation",
                                target.externalReferenceNumber ?: "",
                            ),
                            listOf(
                                "Type de véhicule",
                                "Navire",
                                "MMSI",
                                target.mmsi ?: "",
                                "Taille",
                                target.size ?: "",
                            ),
                            listOf(
                                "IMO",
                                target.imo ?: "",
                                "Nom du capitaine",
                                target.operatorName ?: "",
                                "Type de navire",
                                target.vesselType ?: "",
                            ),
                        )
                    }
                }
            }

        rows.forEach { rowData ->
            val row = table.createRow()
            row.height = 300
            row.setHeightRule(TableRowHeightRule.AUTO)

            while (row.tableCells.size < rowData.size) {
                row.addNewTableCell()
            }

            rowData.chunked(2).forEachIndexed { index, pair ->
                val label = pair.getOrElse(0) { "" }
                val value = pair.getOrElse(1) { "" }

                val labelCell = row.getCell(index * 2)
                labelCell.setText(label)
                setCellWidth(labelCell, 1500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "707785")

                val valueCell = row.getCell(index * 2 + 1)
                valueCell.setText(value)
                setCellWidth(valueCell, 1830)
                styleCell(valueCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            }
        }
    }

    private fun translateVehicleType(vehicleType: VehicleTypeEnum?): String =
        when (vehicleType) {
            VehicleTypeEnum.VEHICLE_AIR -> "Véhicule aérien"
            VehicleTypeEnum.VEHICLE_LAND -> "Véhicule terrestre"
            VehicleTypeEnum.VESSEL -> "Navire"
            else -> "Autre véhicule"
        }

    private fun addReportingGeneralInformations(
        table: XWPFTable,
        reporting: EditableBriefReportingEntity,
    ) {
        val row =
            table.createRow().apply {
                height = 300
                setHeightRule(TableRowHeightRule.AUTO)
            }

        while (row.tableCells.size < 6) {
            row.addNewTableCell()
        }

        val labels = listOf("Thématique", "Localisation", "Source")
        val values =
            listOf(
                "${reporting.theme} / ${reporting.subThemes}",
                reporting.localization,
                reporting.reportingSources,
            )

        labels.indices.forEach { i ->
            val labelCell = row.getCell(i * 2)
            configureCell(labelCell, labels[i], bold = false, color = "707785", width = 1200)

            val valueCell = row.getCell(i * 2 + 1)
            configureCell(valueCell, values[i], bold = true, width = 2660)
        }
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

    /******* TABLE *******/
    private fun configureCell(
        cell: XWPFTableCell,
        text: String,
        bold: Boolean,
        color: String? = null,
        width: Int,
    ) {
        cell.setText(text)
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

    private fun deleteFirstEmptyLineInTable(table: XWPFTable) {
        if (table.numberOfRows > 0 &&
            table
                .getRow(0)
                .getCell(0)
                .text
                .isEmpty()
        ) {
            table.removeRow(0)
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
            .getCTTc()
            .addNewTcPr()
            .addNewHMerge()
            .`val` = STMerge.RESTART
        for (col in fromCol + 1..toCol) {
            tableRow
                .getCell(col)
                .getCTTc()
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

    private fun setCellColor(
        cell: XWPFTableCell,
        hexColor: String,
    ) {
        val tableCellProperties = cell.ctTc.addNewTcPr()
        val color = tableCellProperties.addNewShd()
        color.fill = hexColor
    }

    private fun setCellWidth(
        cell: XWPFTableCell,
        width: Int,
    ) {
        val tcPr = cell.ctTc.addNewTcPr()
        val cellWidth = tcPr.addNewTcW()
        cellWidth.w = BigInteger.valueOf(width.toLong())
        cellWidth.type = STTblWidth.DXA
    }

    private fun setTableBorders(
        table: XWPFTable,
        borderColor: String? = "000000",
        withInsideBorder: Boolean = true,
    ) {
        val borderType = STBorder.SINGLE
        val borderSize = BigInteger.valueOf(4) // Border width in 1/8th points (4 = 0.5 points)

        val tblPr = table.ctTbl.tblPr ?: table.ctTbl.addNewTblPr()
        val tableBorders = tblPr.tblBorders ?: tblPr.addNewTblBorders()

        tableBorders.addNewTop().apply {
            `val` = borderType
            sz = borderSize
            color = borderColor
        }

        tableBorders.addNewBottom().apply {
            `val` = borderType
            sz = borderSize
            color = borderColor
        }

        tableBorders.addNewLeft().apply {
            `val` = borderType
            sz = borderSize
            color = borderColor
        }

        tableBorders.addNewRight().apply {
            `val` = borderType
            sz = borderSize
            color = borderColor
        }

        if (withInsideBorder) {
            tableBorders.addNewInsideH().apply {
                `val` = borderType
                sz = borderSize
                color = borderColor
            }

            tableBorders.addNewInsideV().apply {
                `val` = borderType
                sz = borderSize
                color = borderColor
            }
        } else {
            tableBorders.unsetInsideH()
            tableBorders.unsetInsideV()
        }
    }

    private fun styleCell(
        cell: XWPFTableCell,
        bold: Boolean,
        fontSize: Int,
        alignment: ParagraphAlignment,
        color: String? = "000000",
    ) {
        cell.setVerticalAlignment(XWPFTableCell.XWPFVertAlign.CENTER)
        // Ensure the cell has at least one paragraph
        val paragraph =
            if (cell.paragraphs.isEmpty()) {
                cell.addParagraph()
            } else {
                cell.paragraphs[0]
            }

        // Create a new run for the text inside the paragraph
        val run =
            if (paragraph.runs.isEmpty()) {
                paragraph.createRun()
            } else {
                paragraph.runs[0]
            }

        run.isBold = bold
        run.fontSize = fontSize
        run.fontFamily = "Arial"
        run.color = color

        paragraph.alignment = alignment
    }

    /******* IMAGE *******/
    private fun createImageFromBase64(
        name: String,
        image: String?,
        paragraph: XWPFParagraph,
    ) {
        val sanitizedFileName =
            name
                .replace(Regex("[\\\\/:*?\"<>|{}]"), "_")
                .replace("\\s+".toRegex(), "_")

        val imageData = image?.let { cleanBase64String(it) }

        val tempImageFile = File("temp_image_$sanitizedFileName}.png")
        if (imageData != null) {
            tempImageFile.writeBytes(imageData)
        }

        val run: XWPFRun = paragraph.createRun()
        val inputStreamImg = tempImageFile.inputStream()

        run.addPicture(
            inputStreamImg,
            XWPFDocument.PICTURE_TYPE_PNG,
            "$sanitizedFileName.png",
            Units.pixelToEMU(675), // Largeur
            Units.pixelToEMU(450), // Hauteur
        )
        inputStreamImg.close()
        if (!tempImageFile.delete()) {
            logger.warn("Failed to delete temporary image file: ${tempImageFile.absolutePath}")
        }
        run.addBreak()
    }

    private fun createImageFromByteArray(
        imageEntity: ImageEntity,
        document: XWPFDocument,
    ) {
        val paragraph = document.createParagraph()
        val run = paragraph.createRun()

        val tempFile = File.createTempFile("temp_image_${imageEntity.name}", ".tmp")
        tempFile.writeBytes(imageEntity.content)

        try {
            val inputStream = FileInputStream(tempFile)

            val image: BufferedImage = ImageIO.read(tempFile)
            val width = image.width
            val height = image.height
            val imageType =
                when (imageEntity.mimeType.lowercase()) {
                    "image/png" -> XWPFDocument.PICTURE_TYPE_PNG
                    "image/jpeg", "image/jpg" -> XWPFDocument.PICTURE_TYPE_JPEG
                    "image/gif" -> XWPFDocument.PICTURE_TYPE_GIF
                    "image/bmp" -> XWPFDocument.PICTURE_TYPE_BMP
                    "image/wmf" -> XWPFDocument.PICTURE_TYPE_WMF
                    else -> throw IllegalArgumentException("Type d'image non supporté : ${imageEntity.mimeType}")
                }

            run.addPicture(
                inputStream,
                imageType,
                imageEntity.name,
                Units.pixelToEMU(width),
                Units.pixelToEMU(height),
            )

            inputStream.close()
        } finally {
            if (!tempFile.delete()) {
                logger.warn("Failed to delete temporary file: ${tempFile.absolutePath}")
            }
        }
    }

    private fun cleanBase64String(base64String: String): ByteArray {
        val cleanedBase64 = base64String.substringAfter("base64,")
        return Base64.getDecoder().decode(cleanedBase64)
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

    private fun cleanParagraphPlaceholder(
        document: XWPFDocument,
        paragraph: XWPFParagraph,
    ) {
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun convertSvgStringToPngBytes(svgContent: String): ByteArray {
        val transcoder = PNGTranscoder()
        val width = 30f
        val height = 30f

        transcoder.addTranscodingHint(PNGTranscoder.KEY_WIDTH, width)
        transcoder.addTranscodingHint(PNGTranscoder.KEY_HEIGHT, height)

        val inputBytes = svgContent.toByteArray(Charsets.UTF_8)

        return ByteArrayInputStream(inputBytes).use { inputStream ->
            ByteArrayOutputStream().use { outputStream ->
                val input = TranscoderInput(inputStream)
                val output = TranscoderOutput(outputStream)

                transcoder.transcode(input, output)

                outputStream.flush()
                outputStream.toByteArray()
            }
        }
    }

    private fun saveDocument(document: XWPFDocument): File {
        val file = File(editableBriefProperties.tmpDocxPath)

        FileOutputStream(editableBriefProperties.tmpDocxPath).use { document.write(it) }
        document.close()

        return file
    }

    private fun loadTemplateInputStream(): InputStream =
        javaClass.getResourceAsStream(editableBriefProperties.templatePath)
            ?: throw IllegalArgumentException("Template file not found: $editableBriefProperties.templatePath")

    private fun addPageNumbersFooter(document: XWPFDocument) {
        val footerPolicy = XWPFHeaderFooterPolicy(document)
        val footer: XWPFFooter = footerPolicy.createFooter(XWPFHeaderFooterPolicy.DEFAULT)

        val paragraph = footer.createParagraph()
        paragraph.alignment = ParagraphAlignment.RIGHT

        // Create field { PAGE }
        val pageField = paragraph.ctp.addNewFldSimple()
        pageField.instr = "PAGE"
        val pageRun = pageField.addNewR()
        pageRun.addNewT().stringValue = " "
        val pageRunProperties = pageRun.addNewRPr()
        pageRunProperties.addNewRFonts().ascii = "Arial"

        // Add text " / "
        val run = paragraph.createRun()
        run.setText(" / ")
        run.fontFamily = "Arial"

        // Create field { NUMPAGES }
        val numPagesField = paragraph.ctp.addNewFldSimple()
        numPagesField.instr = "NUMPAGES"
        val numPagesRun = numPagesField.addNewR()
        numPagesRun.addNewT().stringValue = " "
        val numPagesRunProperties = numPagesRun.addNewRPr()
        numPagesRunProperties.addNewRFonts().ascii = "Arial"
    }

    private fun setFontForAllParagraphs(document: XWPFDocument) {
        for (paragraph in document.paragraphs) {
            val runs = paragraph.runs
            for (run in runs) {
                run.fontFamily = "Arial"
            }
        }
    }

    private fun createLayerTitle(
        title: String,
        paragraph: XWPFParagraph,
        document: XWPFDocument,
    ) {
        val titleParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())

        titleParagraph.alignment = ParagraphAlignment.LEFT
        val titleRun = titleParagraph.createRun()
        titleRun.isBold = true
        titleRun.fontSize = 12
        titleRun.setText(title)
        titleRun.addBreak()
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
