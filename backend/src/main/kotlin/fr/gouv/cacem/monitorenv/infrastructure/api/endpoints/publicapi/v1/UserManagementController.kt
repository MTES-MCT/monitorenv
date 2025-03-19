package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.DeleteUser
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.SaveUser
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.AddUserDataInput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/authorization/management")
@Tag(name = "APIs for management of user authorizations")
class UserManagementController(
    private val saveUser: SaveUser,
    private val deleteUser: DeleteUser,
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
}
