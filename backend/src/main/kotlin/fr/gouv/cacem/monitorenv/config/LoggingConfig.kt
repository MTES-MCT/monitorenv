package fr.gouv.cacem.monitorenv.config

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.CORRELATION_ID_PRECEDENCE
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.LOG_REQUEST_PRECEDENCE
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.log.CorrelationInterceptor
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.log.LogGETRequests
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class LoggingConfig(
    val mapper: ObjectMapper,
) : WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(CorrelationInterceptor()).order(CORRELATION_ID_PRECEDENCE)
        registry.addInterceptor(LogGETRequests(mapper)).order(LOG_REQUEST_PRECEDENCE)
    }
}
