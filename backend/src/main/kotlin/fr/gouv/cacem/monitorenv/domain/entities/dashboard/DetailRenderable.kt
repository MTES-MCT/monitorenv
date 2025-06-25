package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

interface DetailRenderable {
    val title: String
    val image: String?
    val minimap: String?

    fun buildDetailsRows(document: XWPFDocument): List<List<String>>

    fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    )
}
