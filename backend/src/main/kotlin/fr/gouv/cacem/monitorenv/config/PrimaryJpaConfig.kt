package fr.gouv.cacem.monitorenv.config

import com.zaxxer.hikari.HikariDataSource
import jakarta.persistence.EntityManagerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import javax.sql.DataSource

@Configuration
@EnableJpaRepositories(
    basePackages = [
        "fr.gouv.cacem.monitorenv.infrastructure.database.repositories",
    ],
    entityManagerFactoryRef = "primaryEntityManagerFactory",
    transactionManagerRef = "primaryTransactionManager",
)
class PrimaryJpaConfig(
    @Value("\${spring.datasource.primary.url}") private val url: String,
    @Value("\${spring.datasource.primary.user}") private val username: String,
    @Value("\${spring.datasource.primary.password}") private val password: String,
) {
    @Bean
    @Primary
    fun primaryDataSource(): HikariDataSource {
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
    @Primary
    fun primaryEntityManagerFactory(
        builder: EntityManagerFactoryBuilder,
        @Qualifier("primaryDataSource") dataSource: DataSource,
    ): LocalContainerEntityManagerFactoryBean =
        builder
            .dataSource(dataSource)
            .packages("fr.gouv.cacem.monitorenv")
            .persistenceUnit("primary")
            .build()

    @Bean
    @Primary
    fun primaryTransactionManager(
        @Qualifier("primaryEntityManagerFactory") emf: EntityManagerFactory,
    ): PlatformTransactionManager = JpaTransactionManager(emf)
}
