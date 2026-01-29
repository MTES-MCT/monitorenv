package fr.gouv.cacem.monitorenv.config

import com.zaxxer.hikari.HikariDataSource
import jakarta.persistence.EntityManagerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import javax.sql.DataSource

@Configuration
@EnableJpaRepositories(
    basePackages = [
        "fr.gouv.cacem.monitorenv.infrastructure.cacem.repositories",
    ],
    entityManagerFactoryRef = "cacemEntityManagerFactory",
    transactionManagerRef = "cacemTransactionManager",
)
class CacemJpaConfig(
    @Value("\${spring.datasource.cacem.url}") private val url: String,
    @Value("\${spring.datasource.cacem.user}") private val username: String,
    @Value("\${spring.datasource.cacem.password}") private val password: String,
) {
    @Bean
    fun cacemDataSource(): HikariDataSource {
        val ds = HikariDataSource()
        ds.jdbcUrl = url
        ds.username = username
        ds.password = password
        ds.driverClassName = "org.postgresql.Driver"
        ds.maximumPoolSize = 10
        ds.maxLifetime = 60000
        return ds
    }

    @Bean
    fun cacemEntityManagerFactory(
        builder: EntityManagerFactoryBuilder,
        @Qualifier("cacemDataSource") dataSource: DataSource,
    ): LocalContainerEntityManagerFactoryBean =
        builder
            .dataSource(dataSource)
            .packages("fr.gouv.cacem.monitorenv.infrastructure.cacem.models")
            .persistenceUnit("cacem")
            .build()

    @Bean
    fun debugPrimaryDs(
        @Qualifier("primaryDataSource") ds: DataSource,
    ) = ApplicationRunner {
        println(ds)
    }

    @Bean
    fun cacemTransactionManager(
        @Qualifier("cacemEntityManagerFactory") emf: EntityManagerFactory,
    ): PlatformTransactionManager = JpaTransactionManager(emf)
}
