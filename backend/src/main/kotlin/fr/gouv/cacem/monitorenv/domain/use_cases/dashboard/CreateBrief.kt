package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
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
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.io.path.Path

@UseCase
class CreateBrief(
    private val dashboardRepository: IDashboardRepository,
    private val controlUnitRepository: IControlUnitRepository,
    @Value("\${monitorenv.brief.template.path}") private val docTemplatePath: String,
    @Value("\${monitorenv.brief.tmp_docx.path}") private val docTmpDOCXPath: String,
    @Value("\${monitorenv.brief.tmp_odt.path}") private val docTmpODTPath: String,
    private val legicemProperties: LegicemProperties,
    private val monitorExtProperties: MonitorExtProperties,
) {
    private val logger = LoggerFactory.getLogger(CreateBrief::class.java)

    fun execute(brief: BriefEntity): BriefFileEntity {
        logger.info("Attempt to CREATE BRIEF dashboard")

        println("legicemProperties: ${legicemProperties.id}, ${legicemProperties.password}")
        println("monitorExtProperties: ${monitorExtProperties.id}, ${monitorExtProperties.password}")
        val controlUnits =
            brief.dashboard.controlUnitIds.map {
                controlUnitRepository.findById(it)
            }
        val controlUnitsName = controlUnits.joinToString(", ") { it.name }
        val comments = brief.dashboard.comments
        val editedAt = brief.dashboard.updatedAt ?: brief.dashboard.createdAt
        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
        val formattedDate = editedAt?.format(formatter)

        val name = brief.dashboard.name
        val totalRegulatoryAreas =
            if (brief.dashboard.regulatoryAreaIds.isNotEmpty()) {
                brief.dashboard.regulatoryAreaIds.size
                    .toString()
            } else {
                null
            }
        val totalRegulatoryAreasText =
            if (brief.dashboard.regulatoryAreaIds.isNotEmpty()) "${brief.dashboard.regulatoryAreaIds.size} zones règlementaires" else null

        val totalAmps =
            if (brief.dashboard.ampIds.isNotEmpty()) {
                brief.dashboard.ampIds.size
                    .toString()
            } else {
                null
            }
        val totalAmpsText =
            if (brief.dashboard.ampIds.isNotEmpty()) "${brief.dashboard.ampIds.size} aires marines protégées" else null

        val totalVigilanceAreas =
            if (brief.dashboard.vigilanceAreaIds.isNotEmpty()) {
                brief.dashboard.vigilanceAreaIds.size
                    .toString()
            } else {
                null
            }
        val totalVigilanceAreasText =
            if (brief.dashboard.vigilanceAreaIds.isNotEmpty()) "${brief.dashboard.vigilanceAreaIds.size} zones de vigilance" else null

        val totalReportings =
            if (brief.dashboard.reportingIds.isNotEmpty()) {
                brief.dashboard.reportingIds.size
                    .toString()
            } else {
                null
            }
        val totalReportingsText =
            if (brief.dashboard.reportingIds.isNotEmpty()) "${brief.dashboard.reportingIds.size} signalements" else null

        val totalZones =
            brief.dashboard.regulatoryAreaIds.size + brief.dashboard.ampIds.size + brief.dashboard.vigilanceAreaIds.size

        val placeholders: Map<String, String?> =
            mapOf(
                "\${editedAt}" to (formattedDate),
                "\${briefName}" to (name),
                "\${comments}" to (comments ?: "Pas de commentaire"),
                "\${controlUnits}" to (controlUnitsName),
                "\${totalRegulatoryAreasText}" to (
                    totalRegulatoryAreasText
                        ?: "Aucune zone règlementaire"
                ),
                "\${totalRegulatoryAreas}" to (
                    totalRegulatoryAreas
                        ?: "0"
                ),
                "\${totalAMPsText}" to (totalAmpsText ?: "Aucune aire marine protégée"),
                "\${totalAMPs}" to (totalAmps ?: "0"),
                "\${totalVigilanceAreasText}" to (
                    totalVigilanceAreasText
                        ?: "Aucune zone de vigilance"
                ),
                "\${totalVigilanceAreas}" to (
                    totalVigilanceAreas
                        ?: "0"
                ),
                "\${totalReportingsText}" to (totalReportingsText ?: "Aucun signalement"),
                "\${totalReportings}" to (totalReportings ?: "0"),
                "\${totalZones}" to (totalZones.toString()),
                "\${legicemId}" to (legicemProperties.id),
                "\${legicemPassword}" to (legicemProperties.password),
                "\${monitorExtId}" to (monitorExtProperties.id),
                "\${monitorExtPassword}" to (monitorExtProperties.password),
            )

        val inputStream =
            javaClass.getResourceAsStream(docTemplatePath)
                ?: throw IllegalArgumentException("Template file not found: $docTemplatePath")
        val document = XWPFDocument(inputStream)

        val paragraphs = document.paragraphs.toList() // Create a copy of the paragraphs list

        for (paragraph in paragraphs) {
            replacePlaceholdersInParagraph(paragraph, placeholders)
        }
        replacePlaceholdersInTables(document, placeholders)

        // INSÉRER UNE IMAGE DANS LE DOCUMENT
        val imageData = brief.images?.get(0)?.let { cleanBase64String(it.image) }
        val tempImageFile = File("temp_image.png")
        if (imageData != null) {
            tempImageFile.writeBytes(imageData)
        }

        val paragraph = document.createParagraph()
        val run: XWPFRun = paragraph.createRun()
        val inputStreamImg = tempImageFile.inputStream()

        run.addPicture(
            inputStreamImg,
            XWPFDocument.PICTURE_TYPE_PNG,
            "image.png",
            Units.pixelToEMU(675), // Largeur
            Units.pixelToEMU(450), // Hauteur
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
        val runs = paragraph.runs
        if (runs.isEmpty()) return

        // Reconstruire tout le texte avec ses runs
        val runTextMap = runs.map { it.text() ?: "" }
        val fullText = runTextMap.joinToString("")

        // Vérifier s'il y a des placeholders à remplacer
        var modifiedText = fullText
        var hasChanges = false

        for ((placeholder, value) in placeholders) {
            if (modifiedText.contains(placeholder)) {
                modifiedText = modifiedText.replace(placeholder, value ?: "")
                hasChanges = true
            }
        }

        // Si aucun changement, on ne modifie rien
        if (!hasChanges) return

        // Supprimer le texte de chaque run existant
        for (run in runs) {
            run.setText("", 0)
        }

        // Réécrire le texte en conservant les styles
        var currentIndex = 0
        for (run in runs) {
            val originalText = runTextMap[runs.indexOf(run)]
            val length = originalText.length

            if (currentIndex >= modifiedText.length) break

            val newTextPart = modifiedText.substring(currentIndex, minOf(currentIndex + length, modifiedText.length))
            run.setText(newTextPart, 0)
            currentIndex += newTextPart.length
        }

        // Si du texte reste à écrire, on crée un nouveau run avec le dernier style
        if (currentIndex < modifiedText.length) {
            val lastRun = runs.last()
            val newRun = paragraph.createRun()
            newRun.setText(modifiedText.substring(currentIndex))
            newRun.isBold = lastRun.isBold
            newRun.isItalic = lastRun.isItalic
            newRun.underline = lastRun.underline
            newRun.fontSize = lastRun.fontSize
            newRun.fontFamily = lastRun.fontFamily
        }
    }

    private fun replacePlaceholdersInTables(
        document: XWPFDocument,
        placeholders: Map<String, String?>,
    ) {
        for (table in document.tables) {
            for (row in table.rows) {
                for (cell in row.tableCells) {
                    for (paragraph in cell.paragraphs) {
                        replacePlaceholdersInParagraph(paragraph, placeholders)
                    }
                }
            }
        }
    }
}
