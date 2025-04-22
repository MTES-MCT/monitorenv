package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security

import fr.gouv.cacem.monitorenv.config.ApiClient
import fr.gouv.cacem.monitorenv.config.OIDCProperties
import fr.gouv.cacem.monitorenv.config.ProtectedPathsAPIProperties
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.GetIsAuthorizedUser
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security.input.UserInfo
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.HttpHeaders.Authorization
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import kotlinx.coroutines.runBlocking
import org.springframework.web.filter.OncePerRequestFilter

/**
 * This filter only check user authorization. The JWT issuer public key signature is checked in
 * SecurityConfig.kt
 */
class UserAuthorizationCheckFilter(
    private val oidcProperties: OIDCProperties,
    private val protectedPathsAPIProperties: ProtectedPathsAPIProperties,
    private val apiClient: ApiClient,
    private val getIsAuthorizedUser: GetIsAuthorizedUser,
) : OncePerRequestFilter() {
    companion object {
        const val EMAIL_HEADER = "EMAIL"
    }

    private val currentUserAuthorizationControllerPath = "/bff/v1/authorization/current"

    private val bearerHeaderType = "Bearer"
    private val malformedBearerMessage =
        "Malformed authorization header, header type should be 'Bearer'"
    private val missingOidcEndpointMessage = "Missing OIDC user info endpoint"
    private val missingOidcIssuerEndpointMessage = "Missing issuer URI endpoint"
    private val couldNotFetchUserInfoMessage =
        "Could not fetch user info at ${oidcProperties.issuerUri + oidcProperties.userinfoEndpoint}"
    private val insufficientAuthorizationMessage = "Insufficient authorization"

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) = runBlocking {
        val authorizationHeaderContent = request.getHeader("Authorization")
        val headerType: String? = authorizationHeaderContent?.split(" ")?.get(0)

        if (oidcProperties.enabled == false) {
            logger.debug("OIDC disabled: user authorization is not checked.")
            filterChain.doFilter(request, response)

            return@runBlocking
        }

        logger.debug("Authorization header: $authorizationHeaderContent")

        if (!headerType.equals(bearerHeaderType)) {
            logger.warn(malformedBearerMessage)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, malformedBearerMessage)

            return@runBlocking
        }

        if (oidcProperties.userinfoEndpoint == null) {
            logger.warn(missingOidcEndpointMessage)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, missingOidcEndpointMessage)

            return@runBlocking
        }

        if (oidcProperties.issuerUri == null) {
            logger.warn(missingOidcIssuerEndpointMessage)
            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                missingOidcIssuerEndpointMessage,
            )

            return@runBlocking
        }

        try {
            val userInfoResponse =
                apiClient
                    .httpClient
                    .get(
                        oidcProperties.issuerUri + oidcProperties.userinfoEndpoint,
                    ) { headers { append(Authorization, authorizationHeaderContent!!) } }
                    .body<UserInfo>()

            val isSuperUserPath =
                protectedPathsAPIProperties.superUserPaths?.any {
                    request.requestURI.contains(
                        it,
                    )
                }
                    ?: false
            val isAuthorized = getIsAuthorizedUser.execute(userInfoResponse.email, isSuperUserPath)
            if (!isAuthorized) {
                logger.info(
                    "$insufficientAuthorizationMessage: ${request.requestURI!!} (${userInfoResponse.email})",
                )
                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    insufficientAuthorizationMessage,
                )
            }

            logger.info(
                LoggedMessage(
                    "HTTP request: access granted.",
                    userInfoResponse.email,
                    request.requestURI!!,
                ).toString(),
            )

            if (request.requestURI == currentUserAuthorizationControllerPath) {
                // The email is added as a header so the email will be known by the controller
                response.addHeader(EMAIL_HEADER, userInfoResponse.email)
            }

            filterChain.doFilter(request, response)
        } catch (e: Exception) {
            logger.warn(couldNotFetchUserInfoMessage, e)
            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                couldNotFetchUserInfoMessage,
            )
        }
    }
}
