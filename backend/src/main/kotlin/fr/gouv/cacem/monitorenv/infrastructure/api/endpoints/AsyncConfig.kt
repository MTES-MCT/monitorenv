package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import java.util.concurrent.Executor

@Configuration
@EnableAsync
class AsyncConfig {
    @Bean
    fun taskExecutor(): Executor {
        val executor = ThreadPoolTaskExecutor()
        executor.setCorePoolSize(5)
        executor.setMaxPoolSize(10)
        executor.setQueueCapacity(25)
        executor.setThreadNamePrefix("AsyncExecutor-")
        executor.initialize()
        return executor
    }
}
