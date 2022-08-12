package fr.gouv.cacem.monitorenv.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.PropertyNamingStrategy
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.jsontype.NamedType
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import java.util.*
import org.n52.jackson.datatype.jts.JtsModule

@Configuration
class MapperConfiguration {
    @Bean
    fun objectMapper(): ObjectMapper {
        val mapper = Jackson2ObjectMapperBuilder().build<ObjectMapper>()

        mapper.registerModule(JtsModule())

        // needed to handle java.time.ZonedDateTime serialization
        mapper.registerModule(JavaTimeModule())
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        mapper.propertyNamingStrategy = PropertyNamingStrategy.LOWER_CAMEL_CASE

        return mapper
    }
}
