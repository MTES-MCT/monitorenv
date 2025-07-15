package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.util.Units
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.awt.image.BufferedImage
import java.io.File
import java.io.FileInputStream
import javax.imageio.ImageIO

@Component
class AttachmentFile : BriefFileWriter() {
    private val logger = LoggerFactory.getLogger(AttachmentFile::class.java)

    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    ) {
        applyLinks(document, brief.dashboard.links)
        applyDashboardImages(document, brief.dashboard.images)
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
}
