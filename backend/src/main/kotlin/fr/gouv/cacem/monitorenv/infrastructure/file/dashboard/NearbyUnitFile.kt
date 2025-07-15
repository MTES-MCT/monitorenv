package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefNearbyUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefNearbyUnitEntity.Companion.NB_CELLS
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.MissionStatus
import org.apache.poi.xwpf.usermodel.TableRowHeightRule
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.springframework.stereotype.Component

@Component
class NearbyUnitFile : BriefFileWriter() {
    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
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
}
