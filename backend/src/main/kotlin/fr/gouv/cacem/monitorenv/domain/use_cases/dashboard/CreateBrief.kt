package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.utils.Base64Converter
import fr.gouv.cacem.monitorenv.utils.OfficeConverter
import org.apache.poi.util.Units
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFParagraph
import org.apache.poi.xwpf.usermodel.XWPFRun
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import java.io.File
import java.io.FileOutputStream
import java.util.*
import kotlin.io.path.Path

@UseCase
class Createbrief(
    private val dashboardRepository: IDashboardRepository,
    private val controlUnitRepository: IControlUnitRepository,
    @Value("\${monitorenv.brief.template.path}") private val docTemplatePath: String,
    @Value("\${monitorenv.brief.tmp_docx.path}") private val docTmpDOCXPath: String,
    @Value("\${monitorenv.brief.tmp_odt.path}") private val docTmpODTPath: String,
) {
    private val logger = LoggerFactory.getLogger(Createbrief::class.java)

    fun execute(brief: BriefEntity): BriefFileEntity {
        logger.info("Attempt to CREATE BRIEF dashboard")

        val controlUnits =
            brief.dashboard.controlUnitIds.map {
                controlUnitRepository.findById(it)
            }
        val controlUnitsName = controlUnits.joinToString(", ") { it.name }
        val comments = brief.dashboard.comments
        val placeholders: Map<String, String?> =
            mapOf(
                "\${comments}" to (comments ?: ""),
                "\${controlUnits}" to (controlUnitsName ?: ""),
            )
        val inputStream =
            javaClass.getResourceAsStream(docTemplatePath)
                ?: throw IllegalArgumentException("Template file not found: $docTemplatePath")
        val document = XWPFDocument(inputStream)

        val paragraphs = document.paragraphs.toList() // Create a copy of the paragraphs list
        for (paragraph in paragraphs) {
            replacePlaceholdersInParagraph(paragraph, placeholders)
        }

        // INSÉRER UNE IMAGE DANS LE DOCUMENT
        val imageData = cleanBase64String(brief.images[0].image)
        val tempImageFile = File("temp_image.png")
        tempImageFile.writeBytes(imageData)

        val paragraph = document.createParagraph()
        val run: XWPFRun = paragraph.createRun()
        val inputStreamImg = tempImageFile.inputStream()

        run.addPicture(
            inputStreamImg,
            XWPFDocument.PICTURE_TYPE_PNG,
            "image.png",
            Units.toEMU(426.0), // Largeur
            Units.toEMU(253.0), // Hauteur
        )
        inputStreamImg.close()
        tempImageFile.delete() // Supprimer le fichier temporaire après usage

        // Save the updated document to a new file
        FileOutputStream(docTmpDOCXPath).use { outputStream ->
            document.write(outputStream)
        }

        // Close resources
        document.close()
        inputStream.close()

        println("Template filled successfully and saved as $docTmpDOCXPath")

        val odtFile = OfficeConverter().convert(Path(docTmpDOCXPath).toString(), Path(docTmpODTPath).toString())
        val base64Content = Base64Converter().convertToBase64(odtFile)

        return BriefFileEntity(
            fileName = "Brief-${brief.dashboard.name}.odt",
            fileContent = base64Content,
        )
    }

    private fun cleanBase64String(base64String: String): ByteArray {
        val cleanedBase64 = base64String.substringAfter("base64,") // Supprime le préfixe
        return Base64.getDecoder().decode(cleanedBase64)
    }

    private fun replacePlaceholdersInParagraph(
        paragraph: XWPFParagraph,
        placeholders: Map<String, String?>,
    ) {
        // Loop through the runs (pieces of text) in the paragraph
        for (run in paragraph.runs) {
            var text = run.text() // Get the text in the run
            if (!text.isNullOrEmpty()) {
                // Replace each placeholder with the corresponding value
                for ((placeholder, value) in placeholders) {
                    if (text.contains(placeholder)) {
                        text = text.replace(placeholder, value ?: "")
                    }
                }
                // Set the updated text back to the run
                run.setText(text, 0)
            }
        }
    }
}
