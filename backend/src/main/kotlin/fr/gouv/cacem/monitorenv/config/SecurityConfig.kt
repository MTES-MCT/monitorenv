package fr.gouv.cacem.monitorenv.config

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.GetAuthorizedUser
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.SpaController.Companion.FRONTEND_APP_ROUTES
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.oauth2.core.OAuth2AuthenticationException
import org.springframework.security.oauth2.core.OAuth2Error
import org.springframework.security.oauth2.core.oidc.OidcUserInfo
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.AuthenticationFailureHandler
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher
import org.springframework.security.web.util.matcher.AndRequestMatcher
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.OncePerRequestFilter
import java.net.URI
import java.net.URISyntaxException

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
    val oidcProperties: OIDCProperties,
    val clientRegistrationRepository: ClientRegistrationRepository?,
    private val getAuthorizedUser: GetAuthorizedUser
) {
    private val logger: Logger = LoggerFactory.getLogger(SecurityConfig::class.java)

    @Bean
    @ConditionalOnProperty(value = ["monitorenv.oidc.enabled"], havingValue = "true")
    fun customOidcUserService(): OidcUserService {
        return object : OidcUserService() {
            private val restTemplate = RestTemplate()
            private var userInfoJwtDecoder: JwtDecoder? = null

            override fun loadUser(userRequest: OidcUserRequest): OidcUser =
                try {
                    val oidcUser = super.loadUser(userRequest)

                    return validateAndProcessUser(oidcUser)
                } catch (e: Exception) {
                    // ProConnect returns userinfo as JWT instead of JSON
                    if (e.message?.contains("application/jwt") == true) {
                        logger.info("UserInfo endpoint returned JWT content type, decoding JWT response...")

                        try {
                            val oidcUser = loadUserFromJwtUserInfo(userRequest)

                            return validateAndProcessUser(oidcUser)
                        } catch (jwtError: Exception) {
                            logger.error("⛔ Failed to decode JWT userinfo response", jwtError)

                            throw OAuth2AuthenticationException(
                                OAuth2Error(
                                    "invalid_user_info_response",
                                    "Failed to decode JWT userinfo response: ${jwtError.message}",
                                    null,
                                ),
                                jwtError as Throwable,
                            )
                        }
                    } else {
                        logger.error("⛔ Exception in loadUser", e)
                        throw e
                    }
                }

            private fun loadUserFromJwtUserInfo(userRequest: OidcUserRequest): OidcUser {
                val userInfoUri =
                    userRequest.clientRegistration.providerDetails.userInfoEndpoint.uri
                        ?: throw OAuth2AuthenticationException("user-info-uri is missing")

                logger.debug("Fetching JWT userinfo from: $userInfoUri")

                val headers = HttpHeaders()

                val response =
                    restTemplate.exchange<String>(
                        userInfoUri,
                        HttpMethod.GET,
                        HttpEntity<String>(headers),
                    )

                val jwtToken = response.body ?: throw IllegalArgumentException("Empty userinfo response")

                val claims = decodeAndVerifyJwtClaims(userRequest, jwtToken)
                logger.debug("Successfully decoded JWT userinfo with claims: {}", claims.keys)

                // Create OidcUserInfo and OidcUser with the decoded claims
                val userInfo = OidcUserInfo(claims)
                return DefaultOidcUser(
                    emptyList(),
                    userRequest.idToken,
                    userInfo,
                )
            }

            private fun decodeAndVerifyJwtClaims(
                userRequest: OidcUserRequest,
                jwtToken: String,
            ): Map<String, Any> {
                val jwkSetUri =
                    userRequest.clientRegistration.providerDetails.jwkSetUri
                        ?: throw IllegalArgumentException("Missing JWK set URI")
                val decoder =
                    userInfoJwtDecoder
                        ?: NimbusJwtDecoder
                            .withJwkSetUri(jwkSetUri)
                            .jwsAlgorithms { it.addAll(listOf(SignatureAlgorithm.RS256, SignatureAlgorithm.ES256)) }
                            .build()
                            .also { userInfoJwtDecoder = it }

                return decoder.decode(jwtToken).claims
            }

            private fun validateAndProcessUser(oidcUser: OidcUser): OidcUser {
                val emailClaim = oidcUser.claims["email"] as? String
                logger.debug("User email from JWT: $emailClaim")

                if (emailClaim.isNullOrBlank()) {
                    val errorMsg = "Email claim is missing or empty in JWT"
                    logger.error("❌ $errorMsg")
                    throw OAuth2AuthenticationException(errorMsg)
                }
                val isSuperUser =
                    try {
                        getAuthorizedUser.execute(emailClaim).isSuperUser
                    } catch (e: BackendUsageException) {
                        logger.warn("⛔ User not authorized: ${e.message}")
                        throw OAuth2AuthenticationException(
                            OAuth2Error("user_not_authorized", "User is not registered in MonitorEnv", null),
                            e,
                        )
                    }

                val authorities = if (isSuperUser) {
                    listOf(SimpleGrantedAuthority("ROLE_SUPER_USER"), SimpleGrantedAuthority("ROLE_USER"))
                } else {
                    listOf(SimpleGrantedAuthority("ROLE_USER"))
                }

                logger.info(
                    "User $emailClaim authenticated with authorities: {}",
                    authorities
                )

                return DefaultOidcUser(
                    authorities,
                    oidcUser.idToken,
                    oidcUser.userInfo
                )
            }
        }
    }

    private fun oidcLogoutSuccessHandler(): LogoutSuccessHandler {
        val repository =
            clientRegistrationRepository ?: throw IllegalStateException("ClientRegistrationRepository is null")
        val oidcLogoutSuccessHandler =
            OidcClientInitiatedLogoutSuccessHandler(repository)

        oidcLogoutSuccessHandler.setPostLogoutRedirectUri(oidcProperties.successUrl)

        return LogoutSuccessHandler { request, response, authentication ->
            logger.info("OIDC Logout initiated.")
            oidcLogoutSuccessHandler.onLogoutSuccess(request, response, authentication)
        }
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { csrf ->
                if (oidcProperties.enabled == true) {
                    // Only the session-authenticated `/bff` API needs it: `/api` is called by other apps with an API key
                    csrf
                        .spa()
                        .requireCsrfProtectionMatcher(
                            AndRequestMatcher(
                                CsrfFilter.DEFAULT_CSRF_MATCHER,
                                PathPatternRequestMatcher.withDefaults().matcher("/bff/**"),
                            ),
                        )
                } else {
                    csrf.disable()
                }
            }.authorizeHttpRequests { authorize ->
                if (oidcProperties.enabled == null || oidcProperties.enabled == false) {
                    logger.warn(
                        """
                        ⚠️   WARNING ⚠️   - OIDC Authentication is DISABLED.
                        """.trimIndent(),
                    )

                    authorize.requestMatchers("/**").permitAll()
                } else {
                    logger.warn(
                        """
                        ✅ OIDC Authentication is enabled.
                        """.trimIndent(),
                    )

                    authorize
                        .requestMatchers(
                            "/",
                            *FRONTEND_APP_ROUTES.toTypedArray(),
                            "/index.html",
                            "/*.js",
                            "/*.png",
                            "/*.svg",
                            "/static/**",
                            "/assets/**",
                            "/map-icons/**",
                            "/flags/**",
                            "/robots.txt",
                            "/favicon-32.ico",
                            "/asset-manifest.json",
                            "/swagger-ui/**",
                            "/v3/**",
                            // Used to redirect to the frontend SPA, see Spa.kt
                            "/error",
                            "/api/**",
                            "/version",
                            "/actuator/**",
                            "/proxy/**",
                            "/realms/**",
                            "/resources/**",
                            // TODO: secure SSE endpoints
                            "/bff/reportings/sse/**",
                        ).permitAll()
                        .anyRequest()
                        .authenticated()
                }
            }

        if (oidcProperties.enabled == true) {
            http.addFilterAfter(CsrfCookieFilter(), CsrfFilter::class.java)
        }

        if (oidcProperties.enabled == true && clientRegistrationRepository != null) {
            http
                .oauth2Login { oauth2 ->
                    oauth2
                        .userInfoEndpoint { userInfo ->
                            userInfo.oidcUserService(customOidcUserService())
                        }.loginPage(oidcProperties.loginUrl)
                        .successHandler(successHandler())
                        .failureHandler(authenticationFailureHandler())
                }.logout { logout ->
                    logout
                        .logoutSuccessHandler(oidcLogoutSuccessHandler())
                        .logoutRequestMatcher(
                            PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.GET, "/logout"),
                        ).invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                }
        }

        return http.build()
    }

    @Bean
    @ConditionalOnProperty(value = ["monitorenv.oidc.enabled"], havingValue = "true")
    fun successHandler(): AuthenticationSuccessHandler {
        logger.info("Redirect URL is: '${oidcProperties.successUrl}'")
        return SimpleUrlAuthenticationSuccessHandler(oidcProperties.successUrl)
    }

    @Bean
    @ConditionalOnProperty(value = ["monitorenv.oidc.enabled"], havingValue = "true")
    fun authenticationFailureHandler(): AuthenticationFailureHandler =
        object : SimpleUrlAuthenticationFailureHandler(oidcProperties.errorUrl) {
            override fun onAuthenticationFailure(
                request: HttpServletRequest,
                response: HttpServletResponse,
                exception: AuthenticationException,
            ) {
                val errorMessage =
                    exception.message
                        ?: exception.cause?.message
                        ?: exception.javaClass.simpleName

                logger.error("❌ Authentication failed: $errorMessage", exception)

                // Log the full exception chain for debugging
                if (exception.cause != null) {
                    logger.error(
                        "Caused by: ${exception.cause?.javaClass?.simpleName} - ${exception.cause?.message}",
                    )
                }

                super.onAuthenticationFailure(request, response, exception)
            }
        }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        // Called by MonitorEnv and RapportNav (protected by API key on public paths, not by the session)
        val externalApiConfiguration =
            CorsConfiguration().apply {
                allowedOriginPatterns = listOf("*")
                allowedMethods = listOf("HEAD", "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
                allowCredentials = true
            }
        val sessionConfiguration =
            CorsConfiguration().apply {
                allowedOrigins = getSessionAllowedOrigins()
                allowedMethods = listOf("HEAD", "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type", CSRF_HEADER_NAME)
                allowCredentials = true
            }
        logger.info("CORS allowed origins for session-authenticated endpoints: ${sessionConfiguration.allowedOrigins}")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/api/**", externalApiConfiguration)
        // Local Keycloak proxy (development and E2E only): its login form is posted with `Origin: null`,
        // as Keycloak pages are served with `Referrer-Policy: no-referrer`
        source.registerCorsConfiguration("/realms/**", externalApiConfiguration)
        source.registerCorsConfiguration("/**", sessionConfiguration)


        return source
    }

    private fun getSessionAllowedOrigins(): List<String> {
        val configuredOrigins = oidcProperties.allowedOrigins.map { it.trim().trimEnd('/') }.filter { it.isNotEmpty() }
        if (configuredOrigins.isNotEmpty()) {
            return configuredOrigins
        }

        return try {
            val successUri = URI(oidcProperties.successUrl)
            if (successUri.scheme == null || successUri.host == null) {
                return listOf()
            }
            val port = if (successUri.port == -1) "" else ":${successUri.port}"

            listOf("${successUri.scheme}://${successUri.host}$port")
        } catch (_: URISyntaxException) {
            listOf()
        }
    }

    /** Spring Security loads the CSRF token lazily: the frontend needs its cookie before its first mutation. */
    private class CsrfCookieFilter : OncePerRequestFilter() {
        override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain,
        ) {
            (request.getAttribute(CsrfToken::class.java.name) as? CsrfToken)?.token
            filterChain.doFilter(request, response)
        }
    }

    companion object {
        const val CSRF_HEADER_NAME = "X-XSRF-TOKEN"
    }
}
