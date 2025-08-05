package fr.gouv.cacem.monitorenv.utils

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import org.apache.poi.util.Units
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.awt.image.BufferedImage
import java.io.File
import java.io.FileInputStream
import javax.imageio.ImageIO

class ByteArrayConverter {
    companion object {
        private val logger: Logger = LoggerFactory.getLogger(ByteArrayConverter::class.java)

        fun createImageFromByteArray(
            imageEntity: ImageEntity,
            paragraph: XWPFParagraph,
        ) {
            val run = paragraph.createRun()

            val tempFile = File.createTempFile("temp_image_${imageEntity.name}", ".tmp")
            tempFile.writeBytes(imageEntity.content)

            try {
                val inputStream = FileInputStream(tempFile)

                val image: BufferedImage = ImageIO.read(tempFile)
                val ratio = image.width.toDouble() / image.height.toDouble()
                var width = 675
                var height = (675 / ratio).toInt()
                if (ratio < 1) {
                    height = 650
                    width = (height * ratio).toInt()
                }

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
}
