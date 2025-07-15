package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFTableCell

interface CustomizableCell {
    fun customizeValueCell(
        rowIndex: Int,
        cell: XWPFTableCell,
        document: XWPFDocument,
    )
}
