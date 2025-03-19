package fr.gouv.cacem.monitorenv.config

import io.swagger.v3.oas.models.ExternalDocumentation
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SwaggerConfig {
    @Autowired
    private val hostProperties: HostProperties? = null

    @Bean
    fun api(): OpenAPI =
        OpenAPI()
            .info(
                Info()
                    .title("MonitorEnv public & BFF API")
                    .description("MonitorEnv")
                    .version("v0.0.1")
                    .license(
                        License()
                            .name("Apache 2.0")
                            .url("https://github.com/MTES-MCT/monitorenv/blob/main/LICENSE"),
                    ),
            ).externalDocs(
                ExternalDocumentation()
                    .description("MonitorEnv is part of the beta.gouv.fr program")
                    .url("https://beta.gouv.fr/startups/monitorfish.html"),
            )
}
