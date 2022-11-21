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
    fun api(): OpenAPI {
        return OpenAPI()
            .info(
                Info().title("API Documentation")
                    .description("This is a public API")
                    .version("v0.0.1")
                    .license(
                        License().name("Apache 2.0")
                            .url("https://github.com/MTES-MCT/monitorenv/blob/master/LICENCE")
                    )
            )
            .externalDocs(
                ExternalDocumentation()
                    .description("SpringShop Wiki Documentation")
                    .url("https://springshop.wiki.github.org/docs")
            )
    }
}
