package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRecentActivityEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.TableRowHeightRule
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFTable
import org.springframework.stereotype.Component

@Component
class RecentActivityFile(
    private val controlUnitRepository: IControlUnitRepository,
    private val themeRepository: IThemeRepository,
) : BriefFileWriter() {
    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${recentActivityDetails}") }?.let { paragraph ->
            createRecentActivityDetails(paragraph, brief.recentActivity)
        }
    }

    private fun createRecentActivityDetails(
        paragraph: XWPFParagraph,
        recentActivity: EditableBriefRecentActivityEntity,
    ) {
        val document = paragraph.document as XWPFDocument

        if (recentActivity.recentActivities.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }

        val wrapperParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
        val wrapperTable = document.insertNewTbl(wrapperParagraph.ctp.newCursor())
        deleteFirstEmptyLineInTable(wrapperTable)
        wrapperTable.setWidth(10000)
        setTableBorders(wrapperTable, "FFFFFF", false)

        val firstRow =
            wrapperTable.createRow().apply {
                height = 300
                heightRule = TableRowHeightRule.AUTO
            }
        val firstCell = firstRow.getCell(0) ?: firstRow.createCell()
        setCellWidth(firstCell, 5000)
        val firstCellParagraph = firstCell.addParagraph()

        val imageParagraph = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())
        createImageFromBase64(
            name = "all_recent_activity",
            image = recentActivity.image,
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
                recentActivity.recentActivities.sumOf { it.nbControls }

            val pluralTotalControls = getPlural(totalControls)
            val totalNbTarget =
                recentActivity.recentActivities.sumOf { it.nbTarget }

            val pluralTotalNbTarget = getPlural(totalNbTarget)
            setText(
                "$totalControls actions de contrôle$pluralTotalControls et $totalNbTarget cible$pluralTotalNbTarget contrôlée$pluralTotalNbTarget",
            )
            fontSize = 8
            isItalic = true
            fontFamily = "Arial"
            addBreak()
            addBreak()
        }
        val themesTable = createThemeTable(document, firstCellParagraph)

        val themes = themeRepository.findAllById(recentActivity.recentActivities.flatMap { it.themeIds }.distinct())

        val controlsByThemeId: Map<Int, Int> =
            recentActivity.recentActivities
                .flatMap { control -> control.themeIds.map { themeId -> themeId to control.nbControls } }
                .groupBy({ it.first }, { it.second })
                .mapValues { (_, nbControlsList) -> nbControlsList.sum() }

        fillThemesTable(themesTable, controlsByThemeId, themes)

        val controlUnits =
            controlUnitRepository.findAllById(
                recentActivity.recentActivities.flatMap { it.controlUnitIds }.distinct(),
            )

        createUnitTable(document, firstCellParagraph, controlUnits)

        if (recentActivity.selectedControlUnits.isEmpty()) {
            cleanParagraphPlaceholder(document, paragraph)
            return
        }
        var wrapperTableRow = firstRow

        recentActivity.selectedControlUnits.forEachIndexed { index, selectedControlUnit ->
            val recentActivitiesPerUnit =
                recentActivity.recentActivities.filter { it.controlUnitIds.contains(selectedControlUnit.id) }
            if (index % 2 == 1) {
                wrapperTableRow = wrapperTable.createRow()
                wrapperTableRow.isCantSplitRow = true
            }
            val wrapperTableCell = wrapperTableRow.getCell((index + 1) % 2) ?: wrapperTableRow.createCell()
            val cellParagraph = wrapperTableCell.addParagraph()

            val controlUnit = controlUnitRepository.findById(selectedControlUnit.id)

            val imageParagraph = document.insertNewParagraph(cellParagraph.ctp.newCursor())

            createImageFromBase64(
                name = "Activites recentes ${controlUnit?.name}",
                image = selectedControlUnit.image,
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
                val totalControls = recentActivitiesPerUnit.sumOf { it.nbControls }
                val pluralTotalControls = getPlural(totalControls)
                val totalNbTarget = recentActivitiesPerUnit.sumOf { it.nbTarget }
                val pluralTotalNbTarget = getPlural(totalNbTarget)
                setText(
                    "$totalControls action$pluralTotalControls de contrôle$pluralTotalControls et $totalNbTarget cible$pluralTotalNbTarget contrôlée$pluralTotalNbTarget",
                )
                fontSize = 8
                isItalic = true
                fontFamily = "Arial"
                addBreak()
                addBreak()
            }

            val controlsByThemeId: Map<Int, Int> =
                recentActivitiesPerUnit
                    .flatMap { control -> control.themeIds.map { themeId -> themeId to control.nbControls } } // (themeId, nbControls)
                    .groupBy({ it.first }, { it.second }) // groupBy themeId
                    .mapValues { (_, nbControlsList) -> nbControlsList.sum() }

            if (controlsByThemeId.isNotEmpty()) {
                val themesTable = createThemeTable(document, cellParagraph)

                val themes = themeRepository.findAllById(recentActivitiesPerUnit.flatMap { it.themeIds })

                fillThemesTable(themesTable, controlsByThemeId, themes)
            }
        }

        cleanParagraphPlaceholder(document, paragraph)
    }

    private fun createUnitTable(
        document: XWPFDocument,
        firstCellParagraph: XWPFParagraph,
        controlUnits: List<ControlUnitEntity>,
    ) {
        val tableParagraph = document.insertNewParagraph(firstCellParagraph.ctp.newCursor())
        val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
        table.setWidth(4800)
        setTableBorders(table, "CCCFD6", false)

        val unitHeaderRow = table.getRow(0) ?: table.createRow()
        unitHeaderRow.apply {
            height = 400
            heightRule = TableRowHeightRule.AT_LEAST
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
                    height = 300
                    heightRule = TableRowHeightRule.AT_LEAST
                }
            val labelCell = unitRow.getCell(0) ?: unitRow.createCell()
            labelCell.text = controlUnit.name
            styleCell(labelCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
        }
    }

    private fun createThemeTable(
        document: XWPFDocument,
        paragraph: XWPFParagraph,
    ): XWPFTable {
        val tableParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
        val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
        table.setWidth(4800)
        setTableBorders(table, "CCCFD6", false)

        val headerRow = table.getRow(0) ?: table.createRow()
        headerRow.apply {
            height = 400
            heightRule = TableRowHeightRule.AT_LEAST
        }
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Thématiques")
        styleCell(headerCell, bold = true, fontSize = 9, alignment = ParagraphAlignment.LEFT, color = "707785")
        setCellColor(headerCell, "E5E5EB")
        return table
    }

    private fun fillThemesTable(
        themesTable: XWPFTable,
        controlsByThemeId: Map<Int, Int>,
        themes: List<ThemeEntity>,
    ) {
        controlsByThemeId.map { (themeId, controls) ->
            val newRow =
                themesTable.createRow().apply {
                    height = 300
                    heightRule = TableRowHeightRule.AT_LEAST
                }
            val themeCell = newRow.getCell(0) ?: newRow.createCell()

            themeCell.text = themes.find { it.id == themeId }?.name ?: "Thématique non renseignée"
            styleCell(themeCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            setCellWidth(themeCell, 3000)

            val nbControlsCell = newRow.getCell(1) ?: newRow.createCell()
            val plural = getPlural(controls)
            nbControlsCell.text = "$controls action$plural de ctrl"
            styleCell(
                nbControlsCell,
                bold = false,
                fontSize = 8,
                alignment = ParagraphAlignment.RIGHT,
                color = "707785",
            )
            setCellWidth(nbControlsCell, 2000)
        }
    }
}
