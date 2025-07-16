package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security

import fr.gouv.cacem.monitorenv.config.OIDCProperties
import fr.gouv.cacem.monitorenv.config.ProtectedPathsAPIProperties
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.GetIsAuthorizedUser
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import kotlinx.coroutines.runBlocking
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.filter.OncePerRequestFilter

class UserAuthorizationCheckFilter(
    private val oidcProperties: OIDCProperties,
    private val protectedPathsAPIProperties: ProtectedPathsAPIProperties,
    private val getIsAuthorizedUser: GetIsAuthorizedUser,
) : OncePerRequestFilter() {
    private val insufficientAuthorizationMessage = "Insufficient authorization"
    private val missingAuthenticatedUserMessage = "Missing authenticated user"

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) = runBlocking {
        val authentication = SecurityContextHolder.getContext().authentication

        if (oidcProperties.enabled == false) {
            logger.info("OIDC disabled: user authorization is not checked.")
            filterChain.doFilter(request, response)

            return@runBlocking
        }

        if (authentication == null || !authentication.isAuthenticated) {
            logger.info(missingAuthenticatedUserMessage)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, missingAuthenticatedUserMessage)
            return@runBlocking
        }

        val email = (authentication.principal as OidcUser).email
        logger.info("Authenticated user email/username: $email")
        if (email == null) {
            logger.warn(missingAuthenticatedUserMessage)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, missingAuthenticatedUserMessage)

            return@runBlocking
        }

        val isSuperUserPath =
            protectedPathsAPIProperties.superUserPaths
                ?.any { request.requestURI.contains(it) } ?: false

        val isAuthorized = getIsAuthorizedUser.execute(email, isSuperUserPath)
        if (!isAuthorized) {
            logger.info(
                "$insufficientAuthorizationMessage: ${request.requestURI} ($email)",
            )
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, insufficientAuthorizationMessage)
            return@runBlocking
        }

        logger.info("HTTP request: access granted to $email for URI: ${request.requestURI}")
        filterChain.doFilter(request, response)
    }
}
