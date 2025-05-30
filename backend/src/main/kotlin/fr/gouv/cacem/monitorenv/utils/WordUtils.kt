package fr.gouv.cacem.monitorenv.utils

import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFRelation
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STUnderline
import java.math.BigInteger

object WordUtils {
    fun addHyperlink(
        cell: XWPFTableCell? = null,
        url: String,
        text: String? = "Lien",
        document: XWPFDocument,
        paragraph: XWPFParagraph? = null,
    ) {
        val linkParagraph =
            if (cell != null) {
                cell.addParagraph()
            } else {
                paragraph
            } ?: document.createParagraph()

        val relationshipId = document.packagePart.addExternalRelationship(url, XWPFRelation.HYPERLINK.relation).id
        val cthyperlink = linkParagraph.ctp.addNewHyperlink()
        cthyperlink.id = relationshipId

        // Create a run directly in hyperlink
        val run = cthyperlink.addNewR()
        val rPr = run.addNewRPr()

        val color = rPr.addNewColor()
        color.`val` = "0000FF"
        val underline = rPr.addNewU()
        underline.`val` = STUnderline.SINGLE
        rPr.addNewRFonts().ascii = "Arial"
        rPr.addNewSz().`val` = BigInteger.valueOf(18)
        run.addNewT().stringValue = text
    }
}
