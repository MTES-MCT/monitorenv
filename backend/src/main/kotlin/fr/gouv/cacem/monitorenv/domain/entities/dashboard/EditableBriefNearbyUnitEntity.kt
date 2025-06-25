package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

data class EditableBriefNearbyUnitEntity(
    val controlUnit: LegacyControlUnitEntity,
    val missions: List<MissionEntity>,
) : DetailRenderable {
    override fun buildDetailsRows(): List<List<String>> = listOf()

    override fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    ) {
        if (rowIndex == 1) {
            while (cell.paragraphs.isNotEmpty()) {
                cell.removeParagraph(0)
            }
        }
    }
}
