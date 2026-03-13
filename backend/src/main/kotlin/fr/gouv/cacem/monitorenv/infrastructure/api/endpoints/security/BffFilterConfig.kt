package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security

import fr.gouv.cacem.monitorenv.config.OIDCProperties
import fr.gouv.cacem.monitorenv.config.ProtectedPathsAPIProperties
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.GetIsAuthorizedUser
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.API_KEY_FILTER_PRECEDENCE
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.USER_AUTH_FILTER_PRECEDENCE
import fr.gouv.cacem.monitorenv.infrastructure.api.security.ApiKeyCheckFilter
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class BffFilterConfig(
    private val protectedPathsAPIProperties: ProtectedPathsAPIProperties,
    private val oidcProperties: OIDCProperties,
    private val getIsAuthorizedUser: GetIsAuthorizedUser,
) {
    private val logger: Logger = LoggerFactory.getLogger(BffFilterConfig::class.java)

    @Bean(name = ["userAuthorizationCheckFilter"])
    fun userAuthorizationCheckFilter(): FilterRegistrationBean<UserAuthorizationCheckFilter> {
        val registrationBean =
            FilterRegistrationBean(
                UserAuthorizationCheckFilter(
                    oidcProperties,
                    protectedPathsAPIProperties,
                    getIsAuthorizedUser,
                ),
            )

        registrationBean.order = USER_AUTH_FILTER_PRECEDENCE
        registrationBean.urlPatterns = protectedPathsAPIProperties.paths

        if (registrationBean.urlPatterns.isEmpty()) {
            logger.warn(
                "WARNING: No user authentication path given." +
                    "See `monitorenv.api.protected.paths` application property.",
            )
        }

        logger.info("Adding user authentication for paths: ${protectedPathsAPIProperties.paths}")
        logger.info("Super-user protected paths : ${protectedPathsAPIProperties.superUserPaths}")

        return registrationBean
    }

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
