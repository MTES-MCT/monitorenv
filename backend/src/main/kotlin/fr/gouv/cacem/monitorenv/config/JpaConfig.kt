package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.transaction.annotation.EnableTransactionManagement


@Configuration
@EnableJpaRepositories(basePackages = ["fr.gouv.cacem.monitorenv.infrastructure.database.repositories"])
@EnableTransactionManagement
@EnableAutoConfiguration
@ComponentScan("fr.gouv.cacem.monitorenv")
class JpaConfig