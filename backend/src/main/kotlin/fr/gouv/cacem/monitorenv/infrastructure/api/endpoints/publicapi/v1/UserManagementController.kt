package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.DeleteUser
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.ImportUsers
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.SaveUser
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.users.AddUserDataInput
import fr.gouv.cacem.monitorenv.infrastructure.file.csv.CsvImportUser
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/authorization/management")
@Tag(name = "APIs for management of user authorizations")
class UserManagementController(
    private val saveUser: SaveUser,
    private val deleteUser: DeleteUser,
    private val importUsers: ImportUsers,
    private val csvImportUser: CsvImportUser,
) {
    @PostMapping(value = [""], consumes = ["application/json"])
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new user")
    fun saveUser(
        @RequestBody user: AddUserDataInput,
    ) = saveUser.execute(user.toUserAuthorization())

    @DeleteMapping(value = ["/{email}"])
    @Operation(summary = "Delete a given user")
    fun deleteUser(
        @PathParam("User email")
        @PathVariable(name = "email")
        email: String,
    ) = deleteUser.execute(email)

    @PostMapping("import/super-users", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importSuperUsers(
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<String> {
        if (file.isEmpty) {
            return ResponseEntity.badRequest().body("Le fichier est vide")
        }
        if (file.contentType != "text/csv") {
            return ResponseEntity.badRequest().body("Le format attendu est .csv")
        }
        val userAuthorizations = csvImportUser.parse(file = file, isSuperUser = true)
        val importedUsers = importUsers.execute(userAuthorizations)

        return ResponseEntity.ok("Imported ${importedUsers.size} super-users")
    }

    @PostMapping("import/users", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importUsers(
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<String> {
        if (file.isEmpty) {
            return ResponseEntity.badRequest().body("Le fichier est vide")
        }
        if (file.contentType != "text/csv") {
            return ResponseEntity.badRequest().body("Le format attendu est .csv")
        }
        val userAuthorizations = csvImportUser.parse(file = file, isSuperUser = false)
        val importedUsers = importUsers.execute(userAuthorizations)

        return ResponseEntity.ok("Imported ${importedUsers.size} super-users")
    }
}
