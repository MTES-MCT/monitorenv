package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling

@Configuration
@EnableScheduling
@ConditionalOnProperty(
    value = ["monitorenv.scheduling.enabled"],
    havingValue = "true",
    matchIfMissing = true,
)
public class SchedulingConfig
