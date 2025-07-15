package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.config.EditableBriefProperties
import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DetailWithImagesRenderable
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefAmpEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefNearbyUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefNearbyUnitEntity.Companion.NB_CELLS
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRecentActivityEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefTargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefVigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.MissionStatus
import fr.gouv.cacem.monitorenv.domain.file.dashboard.IDashboardFile
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.file.reporting.ReportingFlags
import fr.gouv.cacem.monitorenv.utils.Base64Converter
import fr.gouv.cacem.monitorenv.utils.OfficeConverter
import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.batik.transcoder.TranscoderInput
import org.apache.batik.transcoder.TranscoderOutput
import org.apache.batik.transcoder.image.PNGTranscoder
import org.apache.poi.util.Units
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy
import org.apache.poi.xwpf.usermodel.BreakType
import org.apache.poi.xwpf.usermodel.Document
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.TableRowHeightRule
import org.apache.poi.xwpf.usermodel.TableWidthType
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFFooter
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFRun
import org.apache.poi.xwpf.usermodel.XWPFTable
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import org.apache.poi.xwpf.usermodel.XWPFTableRow
import org.imgscalr.Scalr
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STBorder
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.awt.Color
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.InputStream
import java.math.BigInteger
import java.time.format.DateTimeFormatter
import java.util.Base64
import java.util.Locale
import javax.imageio.ImageIO

@Component
class DashboardFile(
    private val controlUnitRepository: IControlUnitRepository,
    private val themeRepository: IThemeRepository,
    private val editableBriefProperties: EditableBriefProperties,
    private val legicemProperties: LegicemProperties,
    private val monitorExtProperties: MonitorExtProperties,
    private val reportingFlag: ReportingFlags,
) : IDashboardFile {
    private val logger = LoggerFactory.getLogger(DashboardFile::class.java)

    override fun createEditableBrief(brief: BriefEntity): BriefFileEntity {
        val dashboard = brief.dashboard

        val controlUnits = dashboard.controlUnitIds.map { controlUnitRepository.findById(it) }
        val controlUnitsName =
            if (controlUnits.isNotEmpty()) {
                controlUnits.joinToString(
                    ", ",
                ) { it?.name ?: "Unité inconnue" }
            } else {
                "Aucune unité sélectionnée"
            }

        val placeholders = buildPlaceholders(brief, controlUnitsName)
        val document = XWPFDocument(loadTemplateInputStream())
        applyParagraphReplacements(document, placeholders)
        applyCustomTableInsertions(document, brief)
        applyGlobalMapInsertion(document, brief)
        applyDetailSections(document, brief)
        applyLinks(document, brief.dashboard.links)
        applyDashboardImages(document, brief.dashboard.images)

        addPageNumbersFooter(document)
        setFontForAllParagraphs(document)

        val tempFile = saveDocument(document)
        val odtFile =
            OfficeConverter().convert(editableBriefProperties.tmpDocxPath, editableBriefProperties.tmpOdtPath)
        val base64Content = Base64Converter().convertToBase64(odtFile)
        tempFile.delete()

        return BriefFileEntity(
            fileName = "Brief-${brief.dashboard.name}.odt",
            fileContent = base64Content,
        )
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
        val hasRecentlyNearbyUnits = brief.nearbyUnits.any { it.status === MissionStatus.DONE }
        val nearbyUnitsMinDateRange =
            brief.nearbyUnits
                .filter { it.status == MissionStatus.DONE }
                .mapNotNull { it.minDate }
                .minOrNull()
                ?.format(
                    DateTimeFormatter.ofPattern(
                        "dd/MM/yyyy",
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
                        "dd/MM/yyyy",
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
                        "dd/MM/yyyy",
                        Locale.FRENCH,
                    ),
                )
            } au ${
                brief.recentActivity.startBefore?.format(
                    DateTimeFormatter.ofPattern(
                        "dd/MM/yyyy",
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

    private fun applyDetailSections(
        document: XWPFDocument,
        brief: BriefEntity,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${unitsCurrentlyInArea}") }?.let { paragraph ->
            createNearbyUnitsDetails(
                paragraph,
                brief.nearbyUnits.filter { it.status === MissionStatus.IN_PROGRESS },
            )
        }

        document.paragraphs.firstOrNull { it.text.contains("\${unitsRecentlyInArea}") }?.let { paragraph ->
            createNearbyUnitsDetails(
                paragraph,
                brief.nearbyUnits.filter { it.status === MissionStatus.DONE },
            )
        }

        document.paragraphs.firstOrNull { it.text.contains("\${unitsToBeInArea}") }?.let { paragraph ->
            createNearbyUnitsDetails(
                paragraph,
                brief.nearbyUnits.filter { it.status === MissionStatus.FUTURE },
            )
        }

        document.paragraphs.firstOrNull { it.text.contains("\${recentActivityDetails}") }?.let { paragraph ->
            createRecentActivityDetails(paragraph, brief.recentActivity)
        }

        document.paragraphs.firstOrNull { it.text.contains("\${reportingsDetails}") }?.let { paragraph ->
            createReportingsDetails(paragraph, brief.reportings)
        }

        document.paragraphs.firstOrNull { it.text.contains("\${regulatoryAreasDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.regulatoryAreas)
        }

        document.paragraphs.firstOrNull { it.text.contains("\${ampsDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.amps)
        }

        document.paragraphs.firstOrNull { it.text.contains("\${vigilanceAreasDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.vigilanceAreas)
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

    private fun createNearbyUnitsDetails(
        paragraph: XWPFParagraph,
        nearbyUnits: List<EditableBriefNearbyUnitEntity>,
    ) {
        val document = paragraph.document as XWPFDocument
        if (nearbyUnits.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        paragraph.runs.forEach { it.setText("", 0) }

        for (nearbyUnit in nearbyUnits) {
            val tableParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            deleteFirstEmptyLineInTable(table)
            table.setWidth("100%")
            setTableBorders(table, "CCCFD6", false)

            val row =
                table.createRow().apply {
                    height = 500
                    heightRule = TableRowHeightRule.AUTO
                }

            loop@ for (index in 0..NB_CELLS - 1) {
                val cell = row.getCell(index) ?: row.createCell()
                setCellWidth(cell, 2500)
                cell.paragraphs.toList().forEach { _ -> cell.removeParagraph(0) }
                nearbyUnit.customizeValueCell(index, cell, document)
            }
        }

        cleanParagraphPlaceholder(document, paragraph)
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

    private fun createRecentActivityDetails(
        paragraph: XWPFParagraph,
        item: EditableBriefRecentActivityEntity,
    ) {
        val document = paragraph.document as XWPFDocument

        if (item.recentActivitiesPerUnit.isEmpty()) {
            return
        }
        val wrapperParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
        val wrapperTable = document.insertNewTbl(wrapperParagraph.ctp.newCursor())

        wrapperTable.setWidth("100%")
        setTableBorders(wrapperTable, "FFFFFF", false)

        val firstRow = wrapperTable.createRow()
        val firstCell = firstRow.getCell(0) ?: firstRow.createCell()

        val firstCellParagraph = firstCell.addParagraph()

        val imageParagraph = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())

        firstRow.apply {
            height = 300
            heightRule = TableRowHeightRule.AUTO
        }

        setCellWidth(firstCell, 5000)

        createImageFromBase64(
            name = "all_recent_activity",
            image = item.image,
            paragraph = imageParagraph,
            height = 220,
            width = 330,
        )
        val allRecentActivityTitle = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())
        allRecentActivityTitle.createRun().apply {
            setText("Pression de contrôles - toutes unités confondues")
            isBold = true
            fontSize = 9
            fontFamily = "Arial"
            addBreak()
        }
        val allRecentActivityNbControls = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())

        allRecentActivityNbControls.createRun().apply {
            val totalControls =
                item.recentActivitiesPerUnit.sumOf { recentActivity ->
                    recentActivity.recentControls.sumOf { it.nbControls }
                }
            val pluralTotalControls = if (totalControls > 1) "s" else ""
            val totalNbTarget =
                item.recentActivitiesPerUnit.sumOf { recentActivity ->
                    recentActivity.recentControls.sumOf { it.nbTarget }
                }
            val pluralTotalNbTarget = if (totalNbTarget > 1) "s" else ""
            setText(
                "$totalControls actions de contrôle$pluralTotalControls et $totalNbTarget cible$pluralTotalNbTarget contrôlée$pluralTotalNbTarget",
            )
            fontSize = 8
            isItalic = true
            fontFamily = "Arial"
            addBreak()
            addBreak()
        }
        val themesTableParagraph = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())
        val themesTable = document.insertNewTbl(themesTableParagraph.ctp.newCursor())
        themesTable.setWidth("100%")
        setTableBorders(themesTable, "CCCFD6", false)

        val headerRow = themesTable.getRow(0) ?: themesTable.createRow()
        headerRow.apply {
            height = 300
            setHeightRule(TableRowHeightRule.AUTO)
        }
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Thématiques")
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "707785")
        setCellColor(headerCell, "E5E5EB")

        val themes =
            themeRepository.findAllById(
                item.recentActivitiesPerUnit
                    .flatMap { it.recentControls.flatMap { it.themeIds } }
                    .distinct(),
            )

        val controlsByThemeId: Map<Int, Int> =
            item.recentActivitiesPerUnit
                .flatMap { perUnit -> perUnit.recentControls }
                .flatMap { control -> control.themeIds.map { themeId -> themeId to control.nbControls } }
                .groupBy({ it.first }, { it.second })
                .mapValues { (_, nbControlsList) -> nbControlsList.sum() }

        controlsByThemeId.map { (themeId, controls) ->
            val newRow =
                themesTable.createRow().apply {
                    heightRule = TableRowHeightRule.AUTO
                }
            val themeCell = newRow.getCell(0) ?: newRow.createCell()

            themeCell.text = themes.find { it.id == themeId }?.name ?: "Thématique non renseignée"
            styleCell(themeCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            setCellWidth(themeCell, 3500)
            addBottomBorder(themeCell)

            val nbControlsCell = newRow.getCell(1) ?: newRow.createCell()
            val plural = if (controls > 1) "s" else ""
            nbControlsCell.text = "$controls action$plural de ctrl"
            styleCell(
                nbControlsCell,
                bold = false,
                fontSize = 8,
                alignment = ParagraphAlignment.RIGHT,
                color = "707785",
            )
            setCellWidth(nbControlsCell, 1500)
            addBottomBorder(nbControlsCell)
        }

        val controlUnits =
            controlUnitRepository.findAllById(
                item.recentActivitiesPerUnit
                    .flatMap { recentActivity ->
                        recentActivity.recentControls.flatMap { it.controlUnitIds }
                    }.distinct(),
            )

        val tableParagraph = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())
        val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
        table.setWidth("100%")
        setTableBorders(table, "CCCFD6", false)

        val unitHeaderRow = table.getRow(0) ?: table.createRow()
        unitHeaderRow.apply {
            height = 300
            setHeightRule(TableRowHeightRule.AUTO)
        }
        val unitHeaderCell = unitHeaderRow.getCell(0) ?: unitHeaderRow.createCell()
        unitHeaderCell.setText("Unités concernés")
        styleCell(unitHeaderCell, bold = true, fontSize = 9, alignment = ParagraphAlignment.LEFT, color = "707785")
        setCellColor(unitHeaderCell, "E5E5EB")
        val nbUnitHeaderCell = unitHeaderRow.getCell(1) ?: unitHeaderRow.createCell()
        nbUnitHeaderCell.setText(controlUnits.size.toString())
        styleCell(nbUnitHeaderCell, bold = true, fontSize = 9, alignment = ParagraphAlignment.RIGHT, color = "707785")
        setCellColor(nbUnitHeaderCell, "E5E5EB")

        controlUnits.map { controlUnit ->
            val unitRow =
                table.createRow().apply {
                    heightRule = TableRowHeightRule.AUTO
                }
            val labelCell = unitRow.getCell(0) ?: unitRow.createCell()
            labelCell.text = controlUnit.name
            styleCell(labelCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            addBottomBorder(labelCell)
        }

        var wrapperTableRow = firstRow

        item.recentActivitiesPerUnit.forEachIndexed { index, recentActivity ->
            if (index % 2 == 1) {
                wrapperTableRow = wrapperTable.createRow()
                wrapperTableRow.isCantSplitRow = true
            }
            val wrapperTableCell = wrapperTableRow.getCell((index + 1) % 2) ?: wrapperTableRow.createCell()
            val cellParagraph = wrapperTableCell.addParagraph()

            val controlUnit = controlUnitRepository.findById(recentActivity.controlUnitId)

            val imageParagraph = document.insertNewParagraph(cellParagraph.ctp.newCursor())

            createImageFromBase64(
                name = "Activites recentes ${controlUnit?.name}",
                image = recentActivity.image,
                paragraph = imageParagraph,
                height = 220,
                width = 330,
            )
            val allRecentActivityTitle = document.insertNewParagraph(cellParagraph.ctp.newCursor())
            allRecentActivityTitle.createRun().apply {
                setText("Pression de contrôles - ${controlUnit?.name}")
                isBold = true
                fontSize = 9
                fontFamily = "Arial"
                addBreak()
            }
            val recentActivityNbControls = document.insertNewParagraph(cellParagraph.ctp.newCursor())

            recentActivityNbControls.createRun().apply {
                val totalControls = recentActivity.recentControls.sumOf { it.nbControls }
                val pluralTotalControls = if (totalControls > 1) "s" else ""
                val totalNbTarget = recentActivity.recentControls.sumOf { it.nbTarget }
                val pluralTotalNbTarget = if (totalNbTarget > 1) "s" else ""
                setText(
                    "$totalControls action$pluralTotalControls de contrôle$pluralTotalControls et $totalNbTarget cible$pluralTotalNbTarget contrôlée$pluralTotalNbTarget",
                )
                fontSize = 8
                isItalic = true
                fontFamily = "Arial"
                addBreak()
                addBreak()
            }
            val themesTableParagraph = document.insertNewParagraph(cellParagraph.ctp.newCursor())
            val themesTable = document.insertNewTbl(themesTableParagraph.ctp.newCursor())
            themesTable.setWidth("100%")
            setTableBorders(themesTable, "CCCFD6", false)

            val headerRow = themesTable.getRow(0) ?: themesTable.createRow()
            headerRow.apply {
                height = 300
                setHeightRule(TableRowHeightRule.AUTO)
            }
            val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
            headerCell.setText("Thématiques")
            styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "707785")
            setCellColor(headerCell, "E5E5EB")

            val themes = themeRepository.findAllById(recentActivity.recentControls.flatMap { it.themeIds })

            val controlsByThemeId: Map<Int, Int> =
                recentActivity.recentControls
                    .flatMap { control -> control.themeIds.map { themeId -> themeId to control.nbControls } } // (themeId, nbControls)
                    .groupBy({ it.first }, { it.second }) // groupBy themeId
                    .mapValues { (_, nbControlsList) -> nbControlsList.sum() }

            controlsByThemeId.map { (themeId, controls) ->
                val newRow =
                    themesTable.createRow().apply {
                        heightRule = TableRowHeightRule.AUTO
                    }
                val themeCell = newRow.getCell(0) ?: newRow.createCell()

                themeCell.text = themes.find { it.id == themeId }?.name ?: "Thématique non renseignée"
                styleCell(themeCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
                setCellWidth(themeCell, 3500)
                addBottomBorder(themeCell)

                val nbControlsCell = newRow.getCell(1) ?: newRow.createCell()
                val plural = if (controls > 1) "s" else ""
                nbControlsCell.text = "$controls action$plural de ctrl"
                styleCell(
                    nbControlsCell,
                    bold = false,
                    fontSize = 8,
                    alignment = ParagraphAlignment.RIGHT,
                    color = "707785",
                )
                setCellWidth(nbControlsCell, 1500)
                addBottomBorder(nbControlsCell)
            }
        }

        cleanParagraphPlaceholder(document, paragraph)
    }

    private fun <T : DetailWithImagesRenderable> createDetailsSection(
        paragraph: XWPFParagraph,
        items: List<T>,
    ) {
        val document = paragraph.document as XWPFDocument
        if (items.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        for ((i, item) in items.withIndex()) {
            val itemParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            createLayerTitle(item.title, itemParagraph, document)

            val newParagraph = document.insertNewParagraph(itemParagraph.ctp.newCursor())
            val imageParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())

            createImageFromBase64(
                name = item.title,
                image = item.image,
                minimap = item.minimap,
                paragraph = imageParagraph,
            )

            val tableParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            setTableBorders(table, "D4E5F4")
            table.setWidth("100%")

            val rows = item.buildDetailsRows()

            for ((index, rowData) in rows.withIndex()) {
                val row = table.createRow()

                val labelCell = row.getCell(0) ?: row.createCell()
                labelCell.text = rowData[0]
                setCellWidth(labelCell, 2500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val valueCell = row.getCell(1) ?: row.createCell()
                valueCell.text = rowData[1]
                item.customizeValueCell(index, valueCell, document)

                setCellWidth(valueCell, 7500)
                styleCell(valueCell, bold = false, fontSize = 9, alignment = ParagraphAlignment.LEFT)
            }

            deleteFirstEmptyLineInTable(table)

            if (i < items.lastIndex) {
                tableParagraph.createRun().addBreak(BreakType.PAGE)
            }
        }
        cleanParagraphPlaceholder(document, paragraph)
    }

    private fun mergeImages(
        image: String,
        overlay: String,
    ): ByteArray {
        val mainImageData = cleanBase64String(image)
        val overlayImageData = cleanBase64String(overlay)

        val mainImage = mainImageData.inputStream().use { ImageIO.read(it) }
        val overlayRaw = overlayImageData.inputStream().use { ImageIO.read(it) }

        val overlayWidth = 330
        val overlayHeight = 200
        val overlayResized =
            Scalr.resize(overlayRaw, Scalr.Method.ULTRA_QUALITY, Scalr.Mode.FIT_EXACT, overlayWidth, overlayHeight)

        val borderedOverlay =
            BufferedImage(overlayWidth + 5, overlayHeight + 5, BufferedImage.TYPE_INT_ARGB).apply {
                val g = createGraphics()
                g.color = Color.WHITE
                g.fillRect(0, 0, width, height)
                g.drawImage(overlayResized, 2, 2, null)
                g.dispose()
            }

        // merge image with overlay
        val combined =
            BufferedImage(mainImage.width, mainImage.height, BufferedImage.TYPE_INT_ARGB).apply {
                val g = createGraphics()
                g.drawImage(mainImage, 0, 0, null)
                val x = mainImage.width - borderedOverlay.width - 10
                val y = mainImage.height - borderedOverlay.height - 10
                g.drawImage(borderedOverlay, x, y, null)
                g.dispose()
            }

        return ByteArrayOutputStream().use { outputStream ->
            ImageIO.write(combined, "png", outputStream)
            outputStream.toByteArray()
        }
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

        tableBorders.addNewInsideH().apply {
            `val` = borderType
            sz = borderSize
            color = if (withInsideBorder) borderColor else "FFFFFF"
        }

        tableBorders.addNewInsideV().apply {
            `val` = borderType
            sz = borderSize
            color = if (withInsideBorder) borderColor else "FFFFFF"
        }
    }

    private fun styleCell(
        cell: XWPFTableCell,
        bold: Boolean,
        fontSize: Int,
        alignment: ParagraphAlignment,
        color: String? = "000000",
    ) {
        cell.verticalAlignment = XWPFTableCell.XWPFVertAlign.CENTER
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
        minimap: String? = null,
        height: Int = 450,
        width: Int = 675,
    ) {
        val sanitizedFileName =
            name
                .replace(Regex("[\\\\/:*?\"<>|{}]"), "_")
                .replace("\\s+".toRegex(), "_")

        val imageData: ByteArray? =
            image?.let {
                minimap?.let { minimapData -> mergeImages(it, minimapData) } ?: cleanBase64String(it)
            }

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
            Units.pixelToEMU(width), // Largeur
            Units.pixelToEMU(height), // Hauteur
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
        if (position >= 0) {
            document.removeBodyElement(position)
        }
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
