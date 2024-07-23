package fr.gouv.cacem.monitorenv.config

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.PropertyNamingStrategies
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder

@Configuration
class MapperConfiguration {
    @Bean
    fun objectMapper(): ObjectMapper {
        val mapper = Jackson2ObjectMapperBuilder().build<ObjectMapper>()

        mapper.registerModule(JtsModule())

        // needed to handle java.time.ZonedDateTime serialization
        mapper.registerModule(JavaTimeModule())
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        mapper.propertyNamingStrategy = PropertyNamingStrategies.LOWER_CAMEL_CASE
        // TODO(15/06/2024): Activate this property when all front end API object are iso backend
        mapper.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)

        return mapper
    }
}
