package fr.gouv.cacem.monitorenv.utils

import org.jodconverter.local.LocalConverter
import org.jodconverter.local.office.LocalOfficeManager
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File

class OfficeConverter {
    companion object {
        private val logger: Logger = LoggerFactory.getLogger(OfficeConverter::class.java)

        fun convert(
            sourcePath: String,
            destinationPath: String,
        ): String {
            val officeManager = LocalOfficeManager.install()

            try {
                officeManager.start()
                val converter = LocalConverter.make(officeManager)
                converter.convert(File(sourcePath)).to(File(destinationPath)).execute()
                logger.info("[OfficeConverter::convert] Successfully converted $sourcePath to ODT: $destinationPath")
            } catch (e: Exception) {
                logger.error("[OfficeConverter::convert] error : ${e.message}")
            } finally {
                try {
                    officeManager.stop()
                } catch (e: Exception) {
                    logger.error("[OfficeConverter::convert] error on officeManager.stop() : ${e.message}")
                }
            }

            return destinationPath
        }
    }
}
