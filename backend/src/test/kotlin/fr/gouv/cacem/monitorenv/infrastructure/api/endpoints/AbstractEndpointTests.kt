package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.OIDCProperties
import fr.gouv.cacem.monitorenv.config.ProtectedPathsAPIProperties
import fr.gouv.cacem.monitorenv.config.SecurityConfig
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.authorization.GetAuthorizedUser
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean

@Import(SentryConfig::class, MapperConfiguration::class, SecurityConfig::class)
@EnableConfigurationProperties(OIDCProperties::class, ProtectedPathsAPIProperties::class)
@AutoConfigureMockMvc
abstract class AbstractEndpointTests {
    // Requis par le constructeur de SecurityConfig
    @MockitoBean
    private lateinit var getAuthorizedUser: GetAuthorizedUser
}
