package fr.gouv.cacem.monitorenv.domain.file.csv

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import org.springframework.web.multipart.MultipartFile

interface ICsvImportUser {
    fun parse(
        file: MultipartFile,
        isSuperUser: Boolean,
    ): List<UserAuthorization>
}
