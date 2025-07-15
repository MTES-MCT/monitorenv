package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DetailWithImagesRenderable
import org.apache.batik.transcoder.TranscoderInput
import org.apache.batik.transcoder.TranscoderOutput
import org.apache.batik.transcoder.image.PNGTranscoder
import org.apache.poi.util.Units
import org.apache.poi.xwpf.usermodel.BreakType
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFRun
import org.apache.poi.xwpf.usermodel.XWPFTable
import org.apache.poi.xwpf.usermodel.XWPFTableCell
import org.imgscalr.Scalr
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STBorder
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth
import org.slf4j.LoggerFactory
import java.awt.Color
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.math.BigInteger
import java.util.Base64
import javax.imageio.ImageIO

abstract class BriefFileWriter : IBriefFileWriter {
    private val logger = LoggerFactory.getLogger(BriefFileWriter::class.java)

    /******* IMAGE *******/
    fun createImageFromBase64(
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
            Scalr.resize(overlayRaw, Scalr.Method.QUALITY, Scalr.Mode.FIT_EXACT, overlayWidth, overlayHeight)

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

    private fun cleanBase64String(base64String: String): ByteArray {
        val cleanedBase64 = base64String.substringAfter("base64,")
        return Base64.getDecoder().decode(cleanedBase64)
    }

    fun convertSvgStringToPngBytes(svgContent: String): ByteArray {
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

    /******* TABLE *******/
    fun deleteFirstEmptyLineInTable(table: XWPFTable) {
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

    fun setCellWidth(
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

    /******* STYLE *******/
    fun setCellColor(
        cell: XWPFTableCell,
        hexColor: String,
    ) {
        val tableCellProperties = cell.ctTc.addNewTcPr()
        val color = tableCellProperties.addNewShd()
        color.fill = hexColor
    }

    fun styleCell(
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

    /******* UTILS *******/
    fun cleanParagraphPlaceholder(
        document: XWPFDocument,
        paragraph: XWPFParagraph,
    ) {
        val position = document.getPosOfParagraph(paragraph)
        if (position >= 0) {
            document.removeBodyElement(position)
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

    fun <T : DetailWithImagesRenderable> createDetailsSection(
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
}
