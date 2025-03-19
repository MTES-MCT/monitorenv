package fr.gouv.cacem.monitorenv.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DataSourceProxyTestConfig {
    @Bean
    fun customQueryCountListener(): CustomQueryCountListener? = CustomQueryCountListener()
}
