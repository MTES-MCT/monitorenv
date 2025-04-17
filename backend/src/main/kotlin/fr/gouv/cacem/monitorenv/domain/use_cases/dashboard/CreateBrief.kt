package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.*
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
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
import org.springframework.beans.factory.annotation.Value
import java.awt.image.BufferedImage
import java.io.*
import java.math.BigInteger
import java.time.format.DateTimeFormatter
import java.util.*
import javax.imageio.ImageIO

@UseCase
class CreateBrief(
    private val controlUnitRepository: IControlUnitRepository,
    @Value("\${monitorenv.brief.template.path}") private val docTemplatePath: String,
    @Value("\${monitorenv.brief.tmp_docx.path}") private val docTmpDOCXPath: String,
    @Value("\${monitorenv.brief.tmp_odt.path}") private val docTmpODTPath: String,
    private val legicemProperties: LegicemProperties,
    private val monitorExtProperties: MonitorExtProperties,
) {
    private val logger = LoggerFactory.getLogger(CreateBrief::class.java)

    fun execute(brief: BriefEntity): BriefFileEntity {
        logger.info("Attempt to CREATE BRIEF dashboard")

        val dashboard = brief.dashboard
        val controlUnits = dashboard.controlUnitIds.map { controlUnitRepository.findById(it) }
        val controlUnitsName = controlUnits.joinToString(", ") { it.name }

        val placeholders = buildPlaceholders(brief, controlUnitsName)
        val document = XWPFDocument(loadTemplateInputStream())

        applyParagraphReplacements(document, placeholders)
        applyCustomTableInsertions(document, brief)
        applyImageInsertions(document, brief)
        applyDetailSections(document, brief)
        applyLinks(document, brief.dashboard.links)
        applyDashboardImages(document, brief.dashboard.images)

        addPageNumbersFooter(document)
        setFontForAllParagraphs(document)

        saveDocument(document)

        val odtFile = OfficeConverter().convert(docTmpDOCXPath, docTmpODTPath)
        val base64Content = Base64Converter().convertToBase64(odtFile)

        return BriefFileEntity(
            fileName = "Brief-${brief.dashboard.name}.odt",
            fileContent = base64Content,
        )
    }

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
        ) = if (count > 0) "$count $label" else "Aucun ${label.lowercase()}"

        val regulatoryCount = dashboard.regulatoryAreaIds.size
        val ampCount = dashboard.ampIds.size
        val vigilanceCount = dashboard.vigilanceAreaIds.size
        val reportingCount = dashboard.reportingIds.size
        val totalZones = regulatoryCount + ampCount + vigilanceCount

        return mapOf(
            "\${editedAt}" to formattedDate,
            "\${briefName}" to dashboard.name,
            "\${comments}" to (dashboard.comments ?: "Pas de commentaire"),
            "\${controlUnits}" to controlUnitsName,
            "\${totalRegulatoryAreasText}" to buildCountText("zones règlementaires", regulatoryCount),
            "\${totalRegulatoryAreas}" to regulatoryCount.toString(),
            "\${totalAmpsText}" to buildCountText("aires marines protégées", ampCount),
            "\${totalAmps}" to ampCount.toString(),
            "\${totalVigilanceAreasText}" to buildCountText("zones de vigilance", vigilanceCount),
            "\${totalVigilanceAreas}" to vigilanceCount.toString(),
            "\${totalReportingsText}" to buildCountText("signalements", reportingCount),
            "\${totalReportings}" to reportingCount.toString(),
            "\${totalZones}" to totalZones.toString(),
            "\${legicemId}" to legicemProperties.id,
            "\${legicemPassword}" to legicemProperties.password,
            "\${monitorExtId}" to monitorExtProperties.id,
            "\${monitorExtPassword}" to monitorExtProperties.password,
        )
    }

    private fun loadTemplateInputStream(): InputStream =
        javaClass.getResourceAsStream(docTemplatePath)
            ?: throw IllegalArgumentException("Template file not found: $docTemplatePath")

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

    private fun applyImageInsertions(
        document: XWPFDocument,
        brief: BriefEntity,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${globalMap}") }?.let { paragraph ->
            createImageFromBase64("global_map", brief.image?.image ?: "", paragraph)
            paragraph.runs.forEach { it.setText("", 0) }
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

    private fun saveDocument(document: XWPFDocument) {
        FileOutputStream(docTmpDOCXPath).use { document.write(it) }
        document.close()
    }

    private fun createSideBySideTables(
        paragraph: XWPFParagraph,
        vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
        amps: List<EditableBriefAmpEntity>,
    ) {
        if (vigilanceAreas.isEmpty() && amps.isEmpty()) return
        val document = paragraph.document as XWPFDocument
        val parentTable = document.insertNewTbl(paragraph.ctp.newCursor())
        parentTable.setWidth("100%")
        setTableBorders(parentTable, "FFFFFF")

        val row = parentTable.createRow()
        val vigilanceCell = row.getCell(0) ?: row.createCell()
        val ampsCell = row.getCell(1) ?: row.createCell()

        setCellWidth(vigilanceCell, 4500)
        setCellWidth(ampsCell, 4500)

        vigilanceCell.addParagraph().apply {
            createVigilanceAreasTable(this, vigilanceAreas)
        }

        ampsCell.addParagraph().apply {
            createAmpsTable(this, amps)
        }

        deleteFirstEmptyLineInTable(parentTable)

        // Delete paragraph with placeholder
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun <T> createSimpleTable(
        paragraph: XWPFParagraph,
        data: List<T>,
        title: String,
        headerColor: String,
        headerTextColor: String? = null,
        cellBuilder: (XWPFTableRow, T) -> Unit,
    ) {
        if (data.isEmpty()) return

        val document = paragraph.document as XWPFDocument
        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")
        setTableBorders(table, "D4E5F4")

        val headerRow = table.getRow(0) ?: table.createRow()
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

        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun <T : DetailRenderable> createDetailsSection(
        paragraph: XWPFParagraph,
        items: List<T>,
    ) {
        if (items.isEmpty()) return
        paragraph.runs.forEach { it.setText("", 0) }
        val document = paragraph.document as XWPFDocument

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

        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createRegulatoryTable(
        paragraph: XWPFParagraph,
        regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    ) {
        if (regulatoryAreas.isEmpty()) return
        val document = paragraph.document as XWPFDocument
        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")

        val totalRegulatoryAreas = regulatoryAreas.size

        val headerRow = table.getRow(0) ?: table.createRow()
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Zones règlementaires - $totalRegulatoryAreas sélectionnée(s)")
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "FFFFFF")
        mergeCellsHorizontally(table, 0, 0, 2)
        setCellColor(headerCell, "8CC3C0")

        // Grouped by `layerName`
        val groupedByLayer = regulatoryAreas.groupBy { it.layerName }

        for ((layerName, areas) in groupedByLayer) {
            val firstRowIndex = table.numberOfRows
            val layerCellCreated = mutableMapOf<Int, XWPFTableCell>() // ✅ Pour assurer la fusion correcte

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
                mergeVerticalCells(table, firstRowIndex, 0, areas.size)
            }
            setTableBorders(table, "D4E5F4")
        }

        // Remove the placeholder paragraph
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
        if (reportings.isEmpty()) return

        paragraph.runs.forEach { it.setText("", 0) }
        val document = paragraph.document as XWPFDocument

        for (reporting in reportings) {
            println("reporting for table details: $reporting")

            val tableParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            table.setWidth("100%")
            setTableBorders(table, "CCCFD6", false)

            var svg =
                """
                <svg xmlns="http://www.w3.org/2000/svg" height="8.4" viewBox="0 0 20 20" width="8.4">
                    <rect fill="none" height="20" width="20" />
                    <path d="M-143,6.6-155,1V19h2V11.453Z" fill="${reporting.iconColor}" transform="translate(160)" />
                </svg>
                """.trimIndent()

            if (reporting.isArchived) {
                svg =
                    """
                     <svg xmlns="http://www.w3.org/2000/svg" height="8.4" viewBox="0 0 26 26" width="8.4">
                      <g transform="translate(61 -19)">
                        <path d="M-38.9,27.58-54.5,20.3V43.7h2.6V33.889Z" fill="#fff" stroke="${reporting.iconColor}" stroke-width="1.5" />
                        <path d="M-61,19h26V45H-61Z" fill="none" />
                        <rect fill="none" height="26" transform="translate(-61 19)" width="26" />
                      </g>
                    </svg>
                    """.trimIndent()
            }
            val imageBytes = convertSvgStringToPngBytes(svg, width = 30f, height = 30f)

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

        val run = paragraph.createRun()
        run.addBreak()

        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    fun convertSvgStringToPngBytes(
        svgContent: String,
        width: Float? = null,
        height: Float? = null,
    ): ByteArray {
        val transcoder = PNGTranscoder()

        width?.let { transcoder.addTranscodingHint(PNGTranscoder.KEY_WIDTH, it) }
        height?.let { transcoder.addTranscodingHint(PNGTranscoder.KEY_HEIGHT, it) }

        val inputStream = ByteArrayInputStream(svgContent.toByteArray(Charsets.UTF_8))
        val outputStream = ByteArrayOutputStream()

        val input = TranscoderInput(inputStream)
        val output = TranscoderOutput(outputStream)

        transcoder.transcode(input, output)

        inputStream.close()
        outputStream.flush()
        return outputStream.toByteArray()
    }

    fun addTargetDetailRows(
        table: XWPFTable,
        target: EditableBriefTargetDetailsEntity,
        reporting: EditableBriefReportingEntity,
    ) {
        val rows: List<List<String>> =
            when (reporting.targetType) {
                TargetTypeEnum.INDIVIDUAL ->
                    listOf(
                        listOf(
                            "Type de cible",
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
                            "Type de cible",
                            "Personne morale",
                            "Nom de la personne morale",
                            target.operatorName ?: "",
                            "Identité de la personne contrôlée",
                            target.vesselName ?: "",
                        ),
                    )

                TargetTypeEnum.OTHER ->
                    listOf(
                        listOf("Type de cible", "Autre", "", "", "", ""),
                    )

                else -> {
                    if (reporting.vehicleType != VehicleTypeEnum.VESSEL) {
                        listOf(
                            listOf(
                                "Type de cible",
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
                                "Type de cible",
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

    fun addReportingGeneralInformations(
        table: XWPFTable,
        reporting: EditableBriefReportingEntity,
    ) {
        val row = table.createRow()
        row.height = 300
        row.setHeightRule(TableRowHeightRule.AUTO)

        while (row.tableCells.size < 6) {
            row.addNewTableCell()
        }

        val labels = listOf("Thématique", "Localisation", "Source")
        val values =
            listOf("${reporting.theme} / ${reporting.subThemes}", reporting.localization, reporting.reportingSources)

        for (i in 0 until 3) {
            val labelCell = row.getCell(i * 2)
            labelCell.setText(labels[i])
            setCellWidth(labelCell, 1200)
            styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "707785")
            val labelCellCT = labelCell.ctTc
            val labelTcPr = labelCellCT.tcPr ?: labelCellCT.addNewTcPr()
            val labelBorders = labelTcPr.tcBorders ?: labelTcPr.addNewTcBorders()

            labelBorders.bottom = labelBorders.addNewBottom()
            labelBorders.bottom.`val` = STBorder.SINGLE
            labelBorders.bottom.sz = BigInteger.valueOf(4)
            labelBorders.bottom.color = "CCCFD6"

            val valueCell = row.getCell(i * 2 + 1)
            valueCell.setText(values[i])
            setCellWidth(valueCell, 2660)
            styleCell(valueCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            val valueCellCT = valueCell.ctTc
            val valueTcPr = valueCellCT.tcPr ?: valueCellCT.addNewTcPr()
            val valueBorders = valueTcPr.tcBorders ?: valueTcPr.addNewTcBorders()

            valueBorders.bottom = valueBorders.addNewBottom()
            valueBorders.bottom.`val` = STBorder.SINGLE
            valueBorders.bottom.sz = BigInteger.valueOf(4)
            valueBorders.bottom.color = "CCCFD6"
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

    private fun createImageFromBase64(
        name: String,
        image: String?,
        paragraph: XWPFParagraph,
    ) {
        val imageData = image?.let { cleanBase64String(it) }

        val tempImageFile = File("temp_image_$name}.png")
        if (imageData != null) {
            tempImageFile.writeBytes(imageData)
        }

        val run: XWPFRun = paragraph.createRun()
        val inputStreamImg = tempImageFile.inputStream()

        run.addPicture(
            inputStreamImg,
            XWPFDocument.PICTURE_TYPE_PNG,
            "$name.png",
            Units.pixelToEMU(675), // Largeur
            Units.pixelToEMU(450), // Hauteur
        )
        inputStreamImg.close()
        tempImageFile.delete()
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
            tempFile.delete()
        }
    }

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

    private fun cleanBase64String(base64String: String): ByteArray {
        val cleanedBase64 = base64String.substringAfter("base64,")
        return Base64.getDecoder().decode(cleanedBase64)
    }

    private fun replacePlaceholdersInParagraph(
        paragraph: XWPFParagraph,
        placeholders: Map<String, String?>,
    ) {
        // Loop through the runs (pieces of text) in the paragraph
        for (run in paragraph.runs) {
            var text = run.text() // Get the text in the run
            if (!text.isNullOrEmpty()) {
                // Replace each placeholder with the corresponding value
                for ((placeholder, value) in placeholders) {
                    if (text.contains(placeholder)) {
                        text = text.replace(placeholder, value ?: "")
                        if (value != null && (value.contains("Aucune") || value.contains("Aucun"))) {
                            run.isItalic = true
                            run.isBold = false
                        }
                    }
                }
                // Set the updated text back to the run
                run.setText(text, 0)
            }
        }
    }

    private fun replacePlaceholdersInTables(
        document: XWPFDocument,
        placeholders: Map<String, String?>,
    ) {
        for (table in document.tables) {
            for (row in table.rows) {
                for (cell in row.tableCells) {
                    for (paragraph in cell.paragraphs) {
                        if (paragraph.text.contains("\${briefName}") || paragraph.text.contains("\${editedAt}")) {
                            styleCell(cell, bold = false, fontSize = 9, alignment = ParagraphAlignment.RIGHT)
                        }

                        replacePlaceholdersInParagraph(paragraph, placeholders)
                    }
                }
            }
        }
    }

    private fun mergeCellsHorizontally(
        table: XWPFTable,
        row: Int,
        fromCol: Int,
        toCol: Int,
    ) {
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
        colIndex: Int,
        rowCount: Int,
    ) {
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

    private fun rgbaStringToHex(rgba: String): String? {
        val regex = """rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)""".toRegex()
        val matchResult = regex.find(rgba) ?: return null

        val (r, g, b) = matchResult.destructured

        return String.format("%02X%02X%02X", r.toInt(), g.toInt(), b.toInt())
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

    fun setTableBorders(
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
}
