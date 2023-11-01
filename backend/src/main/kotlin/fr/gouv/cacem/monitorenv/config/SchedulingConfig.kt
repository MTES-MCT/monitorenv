package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling

@ConditionalOnProperty(
    value = ["monitorenv.scheduling.enabled"],
    havingValue = "true",
    matchIfMissing = true
)
@Configuration
@EnableScheduling
public class SchedulingConfig
