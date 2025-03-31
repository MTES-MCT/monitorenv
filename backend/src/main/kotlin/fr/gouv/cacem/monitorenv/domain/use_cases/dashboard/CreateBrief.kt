package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.Base64Converter
import fr.gouv.cacem.monitorenv.utils.OfficeConverter
import org.apache.poi.util.Units
import org.apache.poi.xwpf.usermodel.*
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import java.io.File
import java.io.FileOutputStream
import java.math.BigInteger
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.io.path.Path

@UseCase
class CreateBrief(
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

        val controlUnits =
            brief.dashboard.controlUnitIds.map {
                controlUnitRepository.findById(it)
            }
        val controlUnitsName = controlUnits.joinToString(", ") { it.name }
        val comments = brief.dashboard.comments
        val editedAt = brief.dashboard.updatedAt ?: brief.dashboard.createdAt
        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
        val formattedDate = editedAt?.format(formatter)

        val regulatoryAreas = brief.regulatoryAreas
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

        // Replace placeholders in tables
        replacePlaceholdersInTables(document, placeholders)

        val imageData = brief.images?.get(0)?.let { cleanBase64String(it.image) }
        val tempImageFile = File("temp_image.png")
        if (imageData != null) {
            tempImageFile.writeBytes(imageData)
        }

        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${globalMap}")) {
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

                // Supprimer le texte du placeholder
                paragraph.runs.forEach { it.setText("", 0) }
                break
            }
        }

        replacePlaceholderWithTable(
            document,
            "\${regulatoryAreasTable}",
            regulatoryAreas ?: emptyList(),
            ::createRegulatoryTable,
        )

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

    fun createRegulatoryTable(
        document: XWPFDocument,
        regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    ) {
        if (regulatoryAreas.isEmpty()) return
        val table = document.createTable()

        val totalRegulatoryAreas = regulatoryAreas.size

        // Définition des en-têtes
        val headerRow = table.getRow(0) ?: table.createRow()
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Zones règlementaires - $totalRegulatoryAreas sélectionnée(s)")
        mergeCellsHorizontally(table, 0, 0, 2)
        setCellColor(headerCell, "8CC3C0")

        // ✅ Appliquer une largeur fixe aux colonnes (en twips)
        val colWidths = listOf(3350, 300, 6350) // Largeurs des colonnes en twips

        // Grouper par `layerName`
        val groupedByLayer = regulatoryAreas.groupBy { it.layerName }

        for ((layerName, areas) in groupedByLayer) {
            val firstRowIndex = table.numberOfRows
            val layerCellCreated = mutableMapOf<Int, XWPFTableCell>() // ✅ Pour assurer la fusion correcte

            for ((index, area) in areas.withIndex()) {
                val row = table.createRow()

                // ✅ Définir la largeur fixe des colonnes
                for (i in 0..2) {
                    val cell = row.getCell(i) ?: row.createCell()
                    setCellWidth(cell, colWidths[i])
                }

                // ✅ Colonne 1 : Fusion des `layerName`
                if (index == 0) {
                    row.getCell(0).setText(layerName)
                    layerCellCreated[firstRowIndex] = row.getCell(0) // Stocke la cellule pour fusion
                } else {
                    row.getCell(0).setText("") // Vide si fusionnée
                }

                // ✅ Colonne 2 : Cellule colorée
                val colorCell = row.getCell(1)
                rgbaStringToHex(area.color)?.let { setCellColor(colorCell, it) }

                // ✅ Colonne 3 : Nom de l'entité
                row.getCell(2).setText(area.entityName)
            }
            // ✅ Appliquer la fusion verticale une fois toutes les lignes créées
            if (areas.size > 1) {
                mergeVerticalCells(table, firstRowIndex, 0, areas.size)
            }
        }
    }

    fun mergeCellsHorizontally(
        table: XWPFTable,
        row: Int,
        fromCol: Int,
        toCol: Int,
    ) {
        val tableRow = table.getRow(row) ?: return // Vérifier que la ligne existe

        // 🔹 S'assurer que toutes les cellules existent
        for (i in fromCol..toCol) {
            if (tableRow.getCell(i) == null) {
                tableRow.createCell()
            }
        }

        // 🔹 Appliquer la fusion
        val firstCell = tableRow.getCell(fromCol)
        firstCell
            .getCTTc()
            .addNewTcPr()
            .addNewHMerge()
            .`val` = STMerge.RESTART
        for (col in fromCol + 1..toCol) {
            tableRow
                .getCell(col)
                .getCTTc()
                .addNewTcPr()
                .addNewHMerge()
                .`val` = STMerge.CONTINUE
        }
    }

    // Fusionner les cellules verticalement
    fun mergeVerticalCells(
        table: XWPFTable,
        startRow: Int,
        colIndex: Int,
        rowCount: Int,
    ) {
        for (i in 0 until rowCount) {
            val row = table.getRow(startRow + i)
            val cell = row.getCell(colIndex)

            if (cell != null) { // Vérification stricte
                val tcPr = cell.ctTc.addNewTcPr()
                val vMerge = tcPr.addNewVMerge()

                if (i == 0) {
                    vMerge.`val` = STMerge.RESTART
                } else {
                    vMerge.`val` = STMerge.CONTINUE
                    cell.setText("") // ✅ Supprimer le texte des cellules fusionnées
                }
            }
        }
    }

    fun rgbaStringToHex(rgba: String): String? {
        val regex = """rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)""".toRegex()
        val matchResult = regex.find(rgba) ?: return null

        val (r, g, b) = matchResult.destructured

        return String.format("%02X%02X%02X", r.toInt(), g.toInt(), b.toInt())
    }

    // Appliquer une couleur à une cellule
    fun setCellColor(
        cell: XWPFTableCell,
        hexColor: String,
    ) {
        val tableCellProperties = cell.ctTc.addNewTcPr()
        val color = tableCellProperties.addNewShd()
        color.fill = hexColor
    }

    // ✅ Fonction pour définir la largeur d'une cellule
    fun setCellWidth(
        cell: XWPFTableCell,
        width: Int,
    ) {
        val tcPr = cell.ctTc.addNewTcPr()
        val cellWidth = tcPr.addNewTcW()
        cellWidth.w = BigInteger.valueOf(width.toLong())
        cellWidth.type = STTblWidth.DXA
    }

    private fun <T> replacePlaceholderWithTable(
        document: XWPFDocument,
        placeholder: String,
        data: List<T>?, // Liste nullable
        tableGenerator: (XWPFDocument, List<T>) -> Unit,
    ) {
        if (data.isNullOrEmpty()) return // Ne rien faire si la liste est vide ou null

        for (paragraph in document.paragraphs) {
            if (paragraph.text.contains(placeholder)) {
                paragraph.runs.forEach { it.setText("", 0) }
                tableGenerator(document, data) // On appelle la fonction de génération avec la liste non-nullable
                break
            }
        }
    }
}
