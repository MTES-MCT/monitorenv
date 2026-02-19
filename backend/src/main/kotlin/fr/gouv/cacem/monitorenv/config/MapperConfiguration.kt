package fr.gouv.cacem.monitorenv.config

import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import tools.jackson.databind.PropertyNamingStrategies
import tools.jackson.databind.json.JsonMapper
import tools.jackson.module.kotlin.KotlinFeature
import tools.jackson.module.kotlin.KotlinModule

@Configuration
class MapperConfiguration {
    @Bean
    fun jsonMapper(): JsonMapper {
        val mapperBuilder =
            JsonMapper
                .builder()
                .addModules(
                    JtsModule(),
                    KotlinModule.Builder().configure(KotlinFeature.NullIsSameAsDefault, true).build(),
                ).propertyNamingStrategy(PropertyNamingStrategies.LOWER_CAMEL_CASE)
                .build()
        return mapperBuilder
    }
}
