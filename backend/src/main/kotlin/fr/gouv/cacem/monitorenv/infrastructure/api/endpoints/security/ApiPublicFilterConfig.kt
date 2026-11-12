package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security

import fr.gouv.cacem.monitorenv.config.ProtectedPathsAPIProperties
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.API_KEY_FILTER_PRECEDENCE
import fr.gouv.cacem.monitorenv.infrastructure.api.security.ApiKeyCheckFilter
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ApiPublicFilterConfig(
    private val protectedPathsAPIProperties: ProtectedPathsAPIProperties,
) {
    private val logger: Logger = LoggerFactory.getLogger(ApiPublicFilterConfig::class.java)

    @Bean(name = ["publicPathsApiKeyCheckFilter"])
    fun publicPathsApiKeyCheckFilter(): FilterRegistrationBean<ApiKeyCheckFilter> {
        val registrationBean = FilterRegistrationBean(ApiKeyCheckFilter(protectedPathsAPIProperties))

        registrationBean.order = API_KEY_FILTER_PRECEDENCE
        registrationBean.urlPatterns = protectedPathsAPIProperties.publicPaths
        if (registrationBean.urlPatterns.isEmpty()) {
            logger.warn(
                "WARNING: Public paths are not protected." +
                    "See `monitorenv.api.protected.public-paths` application property.",
            )
        }

        logger.info("Adding api key authentication for public paths: ${protectedPathsAPIProperties.publicPaths}")

        return registrationBean
    }
}
