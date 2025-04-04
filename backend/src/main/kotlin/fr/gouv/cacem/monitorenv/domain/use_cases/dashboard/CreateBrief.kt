package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.LegicemProperties
import fr.gouv.cacem.monitorenv.config.MonitorExtProperties
import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.*
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.Base64Converter
import fr.gouv.cacem.monitorenv.utils.OfficeConverter
import org.apache.poi.util.Units
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy
import org.apache.poi.xwpf.usermodel.*
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STBorder
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STMerge
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STUnderline
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import java.awt.image.BufferedImage
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.math.BigInteger
import java.time.format.DateTimeFormatter
import java.util.*
import javax.imageio.ImageIO
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
        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH)
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

        val amps = brief.amps
        val totalAmps =
            if (brief.dashboard.ampIds.isNotEmpty()) {
                brief.dashboard.ampIds.size
                    .toString()
            } else {
                null
            }
        val totalAmpsText =
            if (brief.dashboard.ampIds.isNotEmpty()) "${brief.dashboard.ampIds.size} aires marines protégées" else null

        val vigilanceAreas = brief.vigilanceAreas
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
                "\${totalAmpsText}" to (totalAmpsText ?: "Aucune aire marine protégée"),
                "\${totalAmps}" to (totalAmps ?: "0"),
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

        var paragraphs = document.paragraphs.toList()
        for (paragraph in paragraphs) {
            replacePlaceholdersInParagraph(paragraph, placeholders)
        }

        paragraphs = document.paragraphs.toList()
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${regulatoryAreasTable}")) {
                createRegulatoryTable(paragraph, regulatoryAreas ?: emptyList())
                break
            }
        }

        paragraphs = document.paragraphs.toList()
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${ampsTable}")) {
                createAmpsTable(paragraph, amps ?: emptyList())
                break
            }
        }
        paragraphs = document.paragraphs.toList()
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${vigilanceAreasTable}")) {
                createVigilanceAreasTable(paragraph, vigilanceAreas ?: emptyList())
                break
            }
        }

        // Replace placeholders in tables
        for (table in document.tables) {
            replacePlaceholdersInTables(document, placeholders)
        }

        // Add global map
        paragraphs = document.paragraphs.toList()
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${globalMap}")) {
                createImageFromBase64(
                    name = "global_map",
                    image = brief.image?.image ?: "",
                    paragraph = paragraph,
                )
                // Supprimer le texte du placeholder
                paragraph.runs.forEach { it.setText("", 0) }
                break
            }
        }

        paragraphs = document.paragraphs
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${regulatoryAreasDetails}")) {
                createRegulatoryAreasDetails(paragraph, regulatoryAreas ?: emptyList())
                break
            }
        }

        paragraphs = document.paragraphs
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${ampsDetails}")) {
                createAmpsDetails(paragraph, amps ?: emptyList())
                break
            }
        }

        paragraphs = document.paragraphs
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${vigilanceAreasDetails}")) {
                createVigilanceAreasDetails(paragraph, vigilanceAreas ?: emptyList())
                break
            }
        }

        paragraphs = document.paragraphs
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${links}")) {
                paragraph.runs.forEach { it.setText("", 0) }
                brief.dashboard.links?.forEach { link ->
                    addHyperlink(null, link.linkUrl, link.linkText, document, paragraph)
                    val paragraphRun = paragraph.createRun()
                    paragraphRun.addBreak()
                }
                break
            }
        }

        paragraphs = document.paragraphs
        for (paragraph in paragraphs) {
            if (paragraph.text.contains("\${images}")) {
                paragraph.runs.forEach { it.setText("", 0) }
                brief.dashboard.images.forEach { image ->
                    createImageFromByteArray(image, document)
                    val paragraphRun = paragraph.createRun()
                    paragraphRun.addBreak()
                }
                break
            }
        }

        addPageNumbersFooter(document)
        setFontForAllParagraphs(document, "Arial")

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

    private fun createRegulatoryTable(
        paragraph: XWPFParagraph,
        regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    ) {
        if (regulatoryAreas.isEmpty()) return
        val document = paragraph.document as XWPFDocument
        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")

        val totalRegulatoryAreas = regulatoryAreas.size

        // Définition des en-têtes
        val headerRow = table.getRow(0) ?: table.createRow()
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Zones règlementaires - $totalRegulatoryAreas sélectionnée(s)")
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "FFFFFF")
        mergeCellsHorizontally(table, 0, 0, 2)
        setCellColor(headerCell, "8CC3C0")

        // Grouper par `layerName`
        val groupedByLayer = regulatoryAreas.groupBy { it.layerName }

        for ((layerName, areas) in groupedByLayer) {
            val firstRowIndex = table.numberOfRows
            val layerCellCreated = mutableMapOf<Int, XWPFTableCell>() // ✅ Pour assurer la fusion correcte

            for ((index, area) in areas.withIndex()) {
                val row = table.createRow()

                if (index == 0) {
                    val nameCell = row.getCell(0)
                    nameCell.setText(layerName)
                    styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
                    setCellWidth(nameCell, 3350)
                    layerCellCreated[firstRowIndex] = row.getCell(0) // Stocke la cellule pour fusion
                } else {
                    row.getCell(0).setText("")
                }

                val colorCell = row.getCell(1)
                rgbaStringToHex(area.color)?.let { setCellColor(colorCell, it) }
                setCellWidth(colorCell, 300)
                styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val entityCell = row.getCell(2) ?: row.createCell()
                entityCell.setText(area.entityName)
                setCellWidth(entityCell, 6350)
                styleCell(entityCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
            }

            if (areas.size > 1) {
                mergeVerticalCells(table, firstRowIndex, 0, areas.size)
            }
            setTableBorders(table, "D4E5F4")
        }
        val run = paragraph.createRun()
        run.addBreak()

        // Remove the placeholder paragraph
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createRegulatoryAreasDetails(
        paragraph: XWPFParagraph,
        regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    ) {
        // Supprimer le texte du placeholder
        paragraph.runs.forEach { it.setText("", 0) }
        val document = paragraph.document as XWPFDocument

        // Boucle sur les éléments regulatoryAreas
        for (regulatoryArea in (regulatoryAreas)) {
            val regulatoryAreaParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())

            createLayerTitle(regulatoryArea.layerName, regulatoryAreaParagraph, document)

            val newParagraph = document.insertNewParagraph(regulatoryAreaParagraph.ctp.newCursor())
            val imageParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())

            createImageFromBase64(
                name = regulatoryArea.layerName,
                image = regulatoryArea.image.image,
                paragraph = imageParagraph,
            )

            val tableParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            setTableBorders(table, "D4E5F4")
            table.setWidth("100%")

            val rows =
                listOf(
                    listOf("Entité", regulatoryArea.entityName),
                    listOf("Ensemble reg", regulatoryArea.refReg ?: ""),
                    listOf("Thématique", regulatoryArea.thematique ?: ""),
                    listOf("Facade", regulatoryArea.facade ?: ""),
                    listOf(
                        "Résumé reg.sur Légicem",
                        regulatoryArea.refReg ?: "",
                    ),
                )

            for ((index, rowData) in rows.withIndex()) {
                val row = table.createRow()
                val labelCell = row.getCell(0) ?: row.createCell()
                labelCell.setText(rowData[0])
                setCellWidth(labelCell, 2500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val valueCell = row.getCell(1) ?: row.createCell()
                if (index == 4) {
                    addHyperlink(valueCell, regulatoryArea.url ?: "", regulatoryArea.refReg, document)
                } else {
                    valueCell.setText(rowData[1])
                }
                setCellWidth(valueCell, 7500)
                styleCell(valueCell, bold = false, fontSize = 9, alignment = ParagraphAlignment.LEFT)
            }

            // Vérifie si la première ligne est vide et supprime-la si nécessaire
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

        // Remove the placeholder paragraph
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createAmpsTable(
        paragraph: XWPFParagraph,
        amps: List<EditableBriefAmpEntity>,
    ) {
        if (amps.isEmpty()) return
        val document = paragraph.document as XWPFDocument
        // Create a new table directly at the placeholder position
        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")
        setTableBorders(table, "D4E5F4")
        val totalAmps = amps.size

        // Définition des en-têtes
        val headerRow = table.getRow(0) ?: table.createRow()
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Aires Marines Protégées - $totalAmps sélectionnée(s)")
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT)
        setCellColor(headerCell, "D6DF64")

        for (amp in amps) {
            val row = table.createRow()
            val colorCell = row.getCell(0) ?: row.createCell()
            rgbaStringToHex(amp.color)?.let { setCellColor(colorCell, it) }
            setCellWidth(colorCell, 400)
            styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

            val nameCell = row.getCell(1) ?: row.createCell()
            nameCell.setText("${amp.name} / ${amp.type}")
            setCellWidth(nameCell, 4600)
            styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
        }

        val run = paragraph.createRun()
        run.addBreak()

        // Remove the placeholder paragraph
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createAmpsDetails(
        paragraph: XWPFParagraph,
        amps: List<EditableBriefAmpEntity>,
    ) {
        // Supprimer le texte du placeholder
        paragraph.runs.forEach { it.setText("", 0) }
        val document = paragraph.document as XWPFDocument

        // Boucle sur les éléments regulatoryAreas
        for (amp in (amps)) {
            val ampParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            createLayerTitle(amp.name, ampParagraph, document)

            val newParagraph = document.insertNewParagraph(ampParagraph.ctp.newCursor())
            val imageParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            createImageFromBase64(
                name = amp.name,
                image = amp.image.image,
                paragraph = imageParagraph,
            )

            val tableParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            setTableBorders(table, "D4E5F4")
            table.setWidth("100%")

            val rows =
                listOf(
                    listOf("Nature d'AMP", amp.designation),
                    listOf(
                        "Résumé reg.sur Légicem",
                        amp.urlLegicem ?: "",
                    ),
                )

            for ((index, rowData) in rows.withIndex()) {
                val row = table.createRow()
                val labelCell = row.getCell(0) ?: row.createCell()
                labelCell.setText(rowData[0])
                setCellWidth(labelCell, 2500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
                val valueCell = row.getCell(1) ?: row.createCell()
                if (index == 1) {
                    addHyperlink(valueCell, amp.urlLegicem ?: "", amp.refReg, document)
                } else {
                    valueCell.setText(rowData[1])
                }
                setCellWidth(valueCell, 7500)
                styleCell(valueCell, bold = false, fontSize = 9, alignment = ParagraphAlignment.LEFT)
            }

            // Vérifie si la première ligne est vide et supprime-la si nécessaire
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

        // Remove the placeholder paragraph
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createVigilanceAreasTable(
        paragraph: XWPFParagraph,
        vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
    ) {
        if (vigilanceAreas.isEmpty()) return
        val document = paragraph.document as XWPFDocument
        // Create a new table directly at the placeholder position
        val table = document.insertNewTbl(paragraph.ctp.newCursor())
        table.setWidth("100%")
        setTableBorders(table, "D4E5F4")
        val totalVigilanceAreas = vigilanceAreas.size

        // Définition des en-têtes
        val headerRow = table.getRow(0) ?: table.createRow()
        val headerCell = headerRow.getCell(0) ?: headerRow.createCell()
        headerCell.setText("Zones de vigilance - $totalVigilanceAreas sélectionnée(s)")
        styleCell(headerCell, bold = true, fontSize = 8, alignment = ParagraphAlignment.LEFT, color = "FFFFFF")
        setCellColor(headerCell, "C58F7E")

        for (vigilanceArea in vigilanceAreas) {
            val row = table.createRow()
            val colorCell = row.getCell(0) ?: row.createCell()
            rgbaStringToHex(vigilanceArea.color)?.let { setCellColor(colorCell, it) }
            setCellWidth(colorCell, 400)
            styleCell(colorCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

            val nameCell = row.getCell(1) ?: row.createCell()
            nameCell.setText(vigilanceArea.name)
            setCellWidth(nameCell, 4600)
            styleCell(nameCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)
        }

        // Remove the placeholder paragraph
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
    }

    private fun createVigilanceAreasDetails(
        paragraph: XWPFParagraph,
        vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
    ) {
        paragraph.runs.forEach { it.setText("", 0) }
        val document = paragraph.document as XWPFDocument

        for (vigilanceArea in (vigilanceAreas)) {
            val vigilanceAreaParagraph = document.insertNewParagraph(paragraph.ctp.newCursor())
            createLayerTitle(vigilanceArea.name, vigilanceAreaParagraph, document)

            val newParagraph = document.insertNewParagraph(vigilanceAreaParagraph.ctp.newCursor())
            val imageParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            createImageFromBase64(
                name = vigilanceArea.name,
                image = vigilanceArea.image.image,
                paragraph = imageParagraph,
            )

            val tableParagraph = document.insertNewParagraph(newParagraph.ctp.newCursor())
            val table = document.insertNewTbl(tableParagraph.ctp.newCursor())
            setTableBorders(table, "D4E5F4")
            table.setWidth("100%")

            val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH)
            val periodDate = "Du ${vigilanceArea.startDatePeriod?.format(formatter)} au ${
                vigilanceArea.endDatePeriod?.format(formatter)
            }"

            val rows =
                listOf(
                    listOf("Période", periodDate),
                    listOf("Thématique", vigilanceArea.themes),
                    listOf(
                        "Visibilité",
                        vigilanceArea.visibility ?: "",
                    ),
                    listOf("Commentaires", vigilanceArea.comments ?: ""),
                    listOf("Réglementations en lien", vigilanceArea.linkedRegulatoryAreas),
                    listOf("Amps en lien", vigilanceArea.linkedAMPs),
                    listOf("Liens utiles", ""),
                )

            for ((index, rowData) in rows.withIndex()) {
                val row = table.createRow()
                val labelCell = row.getCell(0) ?: row.createCell()
                labelCell.setText(rowData[0])
                setCellWidth(labelCell, 2500)
                styleCell(labelCell, bold = false, fontSize = 8, alignment = ParagraphAlignment.LEFT)

                val valueCell = row.getCell(1) ?: row.createCell()
                when (index) {
                    0 -> {
                        val paragraphs = valueCell.paragraphs.toList()
                        paragraphs.forEach { _ -> valueCell.removeParagraph(0) }

                        val cellRun = valueCell.addParagraph().createRun()
                        cellRun.fontFamily = "Arial"
                        cellRun.fontSize = 10
                        cellRun.setText(periodDate)
                        cellRun.addBreak()
                        cellRun.setText(vigilanceArea.frequency)
                        cellRun.addBreak()
                        cellRun.setText(vigilanceArea.endingOccurenceDate)
                    }

                    6 -> {
                        vigilanceArea.links?.map {
                            // valueCell.paragraphs.forEach { valueCell.removeParagraph(0) }
                            addHyperlink(valueCell, it.linkUrl, it.linkText, document)
                        }
                    }

                    else -> {
                        valueCell.setText(rowData[1])
                    }
                }
                setCellWidth(valueCell, 7500)
                styleCell(valueCell, bold = false, fontSize = 9, alignment = ParagraphAlignment.LEFT)
            }

            // Vérifie si la première ligne est vide et supprime-la si nécessaire
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

        // Remove the placeholder paragraph
        val position = document.getPosOfParagraph(paragraph)
        document.removeBodyElement(position)
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

    private fun createImageFromBase64(
        name: String,
        image: String?,
        paragraph: XWPFParagraph,
    ) {
        val imageData = image?.let { cleanBase64String(it) }

        val tempImageFile = File("temp_image_$name}.png")
        if (imageData != null) {
            tempImageFile.writeBytes(imageData)
        }

        val run: XWPFRun = paragraph.createRun()
        val inputStreamImg = tempImageFile.inputStream()

        run.addPicture(
            inputStreamImg,
            XWPFDocument.PICTURE_TYPE_PNG,
            "$name.png",
            Units.pixelToEMU(675), // Largeur
            Units.pixelToEMU(450), // Hauteur
        )
        inputStreamImg.close()
        tempImageFile.delete()
        run.addBreak()
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

            // Déterminer le type d'image Apache POI
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
            tempFile.delete()
        }
    }

    private fun addPageNumbersFooter(document: XWPFDocument) {
        val footerPolicy = XWPFHeaderFooterPolicy(document)
        val footer: XWPFFooter = footerPolicy.createFooter(XWPFHeaderFooterPolicy.DEFAULT)
        // Création d'un paragraphe pour le pied de page
        val paragraph = footer.createParagraph()
        paragraph.alignment = ParagraphAlignment.RIGHT

        // Set transparent background
        val paragraphProperties = paragraph.ctp.addNewPPr()
        val shading = paragraphProperties.addNewShd()
        shading.fill = "auto"

        // Création du champ { PAGE }
        val pageField = paragraph.ctp.addNewFldSimple()
        pageField.instr = "PAGE"
        val pageRun = pageField.addNewR()
        pageRun.addNewT().stringValue = " "
        val pageRunProperties = pageRun.addNewRPr()
        pageRunProperties.addNewRFonts().ascii = "Arial"

        // Ajout du texte " / "
        val run = paragraph.createRun()
        run.setText(" / ")
        run.fontFamily = "Arial"

        // Création du champ { NUMPAGES }
        val numPagesField = paragraph.ctp.addNewFldSimple()
        numPagesField.instr = "NUMPAGES"
        val numPagesRun = numPagesField.addNewR()
        numPagesRun.addNewT().stringValue = " "
        val numPagesRunProperties = numPagesRun.addNewRPr()
        numPagesRunProperties.addNewRFonts().ascii = "Arial"
    }

    private fun setFontForAllParagraphs(
        document: XWPFDocument,
        fontFamily: String,
    ) {
        for (paragraph in document.paragraphs) {
            val runs = paragraph.runs
            for (run in runs) {
                run.fontFamily = fontFamily
            }
        }
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

    private fun replacePlaceholdersInTables(
        document: XWPFDocument,
        placeholders: Map<String, String?>,
    ) {
        for (table in document.tables) {
            for (row in table.rows) {
                for (cell in row.tableCells) {
                    for (paragraph in cell.paragraphs) {
                        if (paragraph.text.contains("\${briefName}") || paragraph.text.contains("\${editedAt}")) {
                            styleCell(cell, bold = false, fontSize = 9, alignment = ParagraphAlignment.RIGHT)
                        }
                        replacePlaceholdersInParagraph(paragraph, placeholders)
                    }
                }
            }
        }
    }

    private fun mergeCellsHorizontally(
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

    private fun mergeVerticalCells(
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

    private fun rgbaStringToHex(rgba: String): String? {
        val regex = """rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)""".toRegex()
        val matchResult = regex.find(rgba) ?: return null

        val (r, g, b) = matchResult.destructured

        return String.format("%02X%02X%02X", r.toInt(), g.toInt(), b.toInt())
    }

    private fun setCellColor(
        cell: XWPFTableCell,
        hexColor: String,
    ) {
        val tableCellProperties = cell.ctTc.addNewTcPr()
        val color = tableCellProperties.addNewShd()
        color.fill = hexColor
    }

    private fun setCellWidth(
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
    ) {
        val borderType = STBorder.SINGLE
        val borderSize = BigInteger.valueOf(4) // Border width in 1/8th points (4 = 0.5 points)

        val tableBorders = table.ctTbl.tblPr.tblBorders

        tableBorders.top.setVal(borderType)
        tableBorders.top.sz = borderSize
        tableBorders.top.color = borderColor

        tableBorders.bottom.setVal(borderType)
        tableBorders.bottom.sz = borderSize
        tableBorders.bottom.color = borderColor

        tableBorders.left.setVal(borderType)
        tableBorders.left.sz = borderSize
        tableBorders.left.color = borderColor

        tableBorders.right.setVal(borderType)
        tableBorders.right.sz = borderSize
        tableBorders.right.color = borderColor

        tableBorders.insideH.setVal(borderType)
        tableBorders.insideH.sz = borderSize
        tableBorders.insideH.color = borderColor

        tableBorders.insideV.setVal(borderType)
        tableBorders.insideV.sz = borderSize
        tableBorders.insideV.color = borderColor
    }

    private fun styleCell(
        cell: XWPFTableCell,
        bold: Boolean,
        fontSize: Int,
        alignment: ParagraphAlignment,
        color: String? = "000000", // Black color in hex,
    ) {
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
                paragraph.runs[0] // Get the existing run if it exists
            }

        // Set the text styling (bold, font size, font family)
        run.isBold = bold
        run.fontSize = fontSize
        run.fontFamily = "Arial"
        run.color = color

        // Align the paragraph
        paragraph.alignment = alignment
    }

    private fun addHyperlink(
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
