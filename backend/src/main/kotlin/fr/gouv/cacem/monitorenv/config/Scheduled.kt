package fr.gouv.cacem.monitorenv.config

import org.springframework.scheduling.annotation.Scheduled

@Scheduled
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class Scheduled(
    val cron: String = "",
    val zone: String = "",
    val fixedDelay: Long = -1,
    val fixedRate: Long = -1,
    val initialDelay: Long = -1,
)
