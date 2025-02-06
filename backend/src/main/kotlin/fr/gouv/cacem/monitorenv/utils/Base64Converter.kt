package fr.gouv.cacem.monitorenv.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.nio.file.Files
import java.nio.file.Path
import java.util.*

class Base64Converter {
    private val logger: Logger = LoggerFactory.getLogger(Base64Converter::class.java)

    fun convertToBase64(filePath: String): String =
        try {
            val odsBytes = Files.readAllBytes(Path.of(filePath))
            Files.delete(Path.of(filePath))
            val base64Content = Base64.getEncoder().encodeToString(odsBytes)
            logger.info("Successfully converted file to Base64: $filePath")
            base64Content
        } catch (e: Exception) {
            logger.error("[ExportExcelFile::convertToBase64] Error: ${e.message}", e)
            throw e
        }
}
