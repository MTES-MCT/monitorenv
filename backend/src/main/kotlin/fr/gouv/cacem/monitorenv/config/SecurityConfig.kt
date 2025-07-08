package fr.gouv.cacem.monitorenv.config

import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.SpaController.Companion.FRONTEND_APP_ROUTES
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
import org.springframework.security.oauth2.core.OAuth2AuthenticationException
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.AuthenticationFailureHandler
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import kotlin.String
import kotlin.apply

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val oidcProperties: OIDCProperties,
) {
    private val logger = LoggerFactory.getLogger(SecurityConfig::class.java)

    @Bean
    fun customOidcUserService(): OidcUserService {
        return object : OidcUserService() {
            override fun loadUser(userRequest: OidcUserRequest): OidcUser {
                try {
                    val oidcUser = super.loadUser(userRequest)
                    val siretsClaimRaw = oidcUser.claims["SIRET"]

                    val tokenSirets: Set<String> =
                        when (siretsClaimRaw) {
                            is List<*> -> siretsClaimRaw.filterIsInstance<String>().toSet()
                            is String -> setOf(siretsClaimRaw)
                            else -> throw OAuth2AuthenticationException("SIRET claim missing or malformed")
                        }

                    val isAuthorized = listOf("1234567890").any { it in tokenSirets }
                    if (!isAuthorized) {
                        throw OAuth2AuthenticationException("User not authorized for the requested SIRET(s)")
                    }
                    return oidcUser
                } catch (e: Exception) {
                    logger.error("⛔ Exception in loadUser", e)
                    throw e
                }
            }
        }
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }
            .authorizeHttpRequests { authorize ->
                if (oidcProperties.enabled == true) {
                    logger.info(
                        """
                        ✅ OIDC Authentication is enabled.
                        """.trimIndent(),
                    )

                    authorize
                        // Autorise tout le monde sur ces routes (ex: statiques, version, health)
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
                            "v3/**",
                            // Used to redirect to the frontend SPA, see Spa.kt
                            "/error",
                            "/api/**",
                            "/version",
                            "/actuator/**",
                            // TODO: secure SSE endpoints
                            "/bff/reportings/sse/**",
                        ).permitAll()
                        .anyRequest()
                        .authenticated()
                } else {
                    logger.warn(
                        """
                        ❌ OIDC Authentication is disabled.
                        All requests will be denied.
                        """.trimIndent(),
                    )
                    authorize.requestMatchers("/**").permitAll()
                }
            }.oauth2Login { oauth2 ->
                oauth2
                    .userInfoEndpoint { userInfo ->
                        userInfo.oidcUserService(customOidcUserService())
                    }.loginPage("/oauth2/authorization/proconnect")
                    .successHandler(successHandler())
                    .failureHandler(authenticationFailureHandler())
            }.logout { logout ->
                logout.logoutSuccessUrl("/login")
            }
        return http.build()
    }

    @Bean
    fun successHandler(): AuthenticationSuccessHandler {
        val redirectUrl = "http://localhost:3000"
        return SimpleUrlAuthenticationSuccessHandler(redirectUrl)
    }

    @Bean
    fun authenticationFailureHandler(): AuthenticationFailureHandler =
        SimpleUrlAuthenticationFailureHandler("/login?error=true")

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration =
            CorsConfiguration().apply {
                allowedOrigins = listOf("*")
                allowedMethods = listOf("HEAD", "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
                allowCredentials = true
            }
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
