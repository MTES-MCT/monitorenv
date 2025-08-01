package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.GetAuthorizedUser
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.UserAuthorizationDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/")
@Tag(name = "APIs for authorization")
class UserAuthorization(
    private val getAuthorizedUser: GetAuthorizedUser,
) {
    private val logger = LoggerFactory.getLogger(UserAuthorization::class.java)

    /**
     * This controller will
     * - return 200 with the UserAuthorization object if the user authorization is found
     * ```
     *     (it passes the filter `UserAuthorizationCheckFilter` - the endpoint is not super-user protected)
     * ```
     * - return an 200 with `isSuperUser=false` if the user authorization is not found
     */
    @GetMapping("v1/authorization/current")
    @Operation(summary = "Get current logged user authorization")
    fun getCurrentUserAuthorization(
        @AuthenticationPrincipal principal: OidcUser?,
    ): UserAuthorizationDataOutput? {
        logger.info("Getting current user authorization $principal")
        if (principal == null) {
            logger.info("Getting current user authorization - OIDC disabled, returning default authorization")
            val authorizedUser = getAuthorizedUser.execute(null)
            return UserAuthorizationDataOutput.fromUserAuthorization(
                authorizedUser = authorizedUser,
            )
        }

        logger.info("Getting current user authorization for user: ${principal.email}")
        val authorizedUser = getAuthorizedUser.execute(principal.email)

        return UserAuthorizationDataOutput.fromUserAuthorization(
            authorizedUser = authorizedUser,
        )
    }
}
