package fr.gouv.cacem.monitorenv.infrastructure.file.csv

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.file.csv.ICsvImportUser
import fr.gouv.cacem.monitorenv.domain.hash
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.multipart.MultipartFile

@Component
class CsvImportUser : ICsvImportUser {
    private val logger = LoggerFactory.getLogger(CsvImportUser::class.java)

    override fun parse(
        file: MultipartFile,
        isSuperUser: Boolean,
    ): List<UserAuthorization> {
        val userAuthorisations = mutableListOf<UserAuthorization>()
        val parser =
            CSVParser.parse(
                file.inputStream,
                Charsets.UTF_8,
                CSVFormat.DEFAULT
                    .builder()
                    .setDelimiter('|')
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setTrim(true)
                    .build(),
            )

        parser.use { records ->
            for (record in records) {
                val mail = record["MEL"]
                if (mail.isNullOrBlank()) {
                    logger.warn("Couldn't parse record, MEL column is missing at line ${record.recordNumber}")
                    continue
                }
                try {
                    val userAuthorisation =
                        UserAuthorization(hashedEmail = hash(mail), isSuperUser = isSuperUser)
                    userAuthorisations.add(userAuthorisation)
                } catch (e: Exception) {
                    logger.error("Error while attempting to parse user import file", e)
                }
            }
        }

        return userAuthorisations
    }
}
