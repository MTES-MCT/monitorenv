package fr.gouv.cacem.monitorenv.config

import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.log.CustomAuthenticationEntryPoint
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    val oidcProperties: OIDCProperties,
    val authenticationEntryPoint: CustomAuthenticationEntryPoint,
) {
    private val logger: Logger = LoggerFactory.getLogger(SecurityConfig::class.java)

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { authorize ->
                if (oidcProperties.enabled == null || oidcProperties.enabled == false) {
                    logger.warn(
                        """
                        ⚠️   WARNING ⚠️   - OIDC Authentication is NOT enabled.
                        """.trimIndent(),
                    )

                    authorize.requestMatchers("/**").permitAll()
                } else {
                    logger.warn(
                        """
                        ✅ OIDC Authentication is enabled.
                        """.trimIndent(),
                    )

                    authorize.requestMatchers(
                        "/",
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
                    ).permitAll()
                        .anyRequest()
                        .authenticated()
                }
            }.oauth2ResourceServer {
                    oauth2ResourceServer ->
                oauth2ResourceServer
                    .jwt(Customizer.withDefaults())
                    .authenticationEntryPoint(authenticationEntryPoint)
            }

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOrigins = listOf("*")
            allowedMethods = listOf("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
        }

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)

        return source
    }
}
