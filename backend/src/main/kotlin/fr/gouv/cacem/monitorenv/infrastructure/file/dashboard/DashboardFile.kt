package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.config.EditableBriefProperties
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity
import fr.gouv.cacem.monitorenv.domain.file.dashboard.IDashboardFile
import fr.gouv.cacem.monitorenv.utils.Base64Converter
import fr.gouv.cacem.monitorenv.utils.OfficeConverter
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy
import org.apache.poi.xwpf.usermodel.ParagraphAlignment
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.apache.poi.xwpf.usermodel.XWPFFooter
import org.springframework.stereotype.Component
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

@Component
class DashboardFile(
    private val editableBriefProperties: EditableBriefProperties,
    private val recentActivityFile: RecentActivityFile,
    private val nearbyUnitFile: NearbyUnitFile,
    private val reportingFile: ReportingFile,
    private val attachmentFile: AttachmentFile,
    private val vigilanceAreaFile: VigilanceAreaFile,
    private val regulatoryAreaFile: RegulatoryAreaFile,
    private val ampFile: AmpFile,
    private val summaryFile: SummaryFile,
) : IDashboardFile {
    override fun createEditableBrief(brief: BriefEntity): BriefFileEntity {
        val document = XWPFDocument(loadTemplateInputStream())

        summaryFile.createSection(brief, document)
        nearbyUnitFile.createSection(brief, document)
        recentActivityFile.createSection(brief, document)
        reportingFile.createSection(brief, document)
        regulatoryAreaFile.createSection(brief, document)
        ampFile.createSection(brief, document)
        vigilanceAreaFile.createSection(brief, document)
        attachmentFile.createSection(brief, document)

        addPageNumbersFooter(document)
        setFontForAllParagraphs(document)

        val tempFile = saveDocument(document)
        val odtFile =
            OfficeConverter.convert(editableBriefProperties.tmpDocxPath, editableBriefProperties.tmpOdtPath)
        val base64Content = Base64Converter.convertToBase64(odtFile)
        tempFile.delete()

        return BriefFileEntity(
            fileName = "Brief-${brief.dashboard.name}.odt",
            fileContent = base64Content,
        )
    }

    private fun saveDocument(document: XWPFDocument): File {
        val file = File(editableBriefProperties.tmpDocxPath)

        FileOutputStream(editableBriefProperties.tmpDocxPath).use { document.write(it) }
        document.close()

        return file
    }

    private fun loadTemplateInputStream(): InputStream =
        javaClass.getResourceAsStream(editableBriefProperties.templatePath)
            ?: throw IllegalArgumentException("Template file not found: $editableBriefProperties.templatePath")

    private fun addPageNumbersFooter(document: XWPFDocument) {
        val footerPolicy = XWPFHeaderFooterPolicy(document)
        val footer: XWPFFooter = footerPolicy.createFooter(XWPFHeaderFooterPolicy.DEFAULT)

        val paragraph = footer.createParagraph()
        paragraph.alignment = ParagraphAlignment.RIGHT

        // Create field { PAGE }
        val pageField = paragraph.ctp.addNewFldSimple()
        pageField.instr = "PAGE"
        val pageRun = pageField.addNewR()
        pageRun.addNewT().stringValue = " "
        val pageRunProperties = pageRun.addNewRPr()
        pageRunProperties.addNewRFonts().ascii = "Arial"

        // Add text " / "
        val run = paragraph.createRun()
        run.setText(" / ")
        run.fontFamily = "Arial"

        // Create field { NUMPAGES }
        val numPagesField = paragraph.ctp.addNewFldSimple()
        numPagesField.instr = "NUMPAGES"
        val numPagesRun = numPagesField.addNewR()
        numPagesRun.addNewT().stringValue = " "
        val numPagesRunProperties = numPagesRun.addNewRPr()
        numPagesRunProperties.addNewRFonts().ascii = "Arial"
    }

    private fun setFontForAllParagraphs(document: XWPFDocument) {
        for (paragraph in document.paragraphs) {
            val runs = paragraph.runs
            for (run in runs) {
                run.fontFamily = "Arial"
            }
        }
    }
}
