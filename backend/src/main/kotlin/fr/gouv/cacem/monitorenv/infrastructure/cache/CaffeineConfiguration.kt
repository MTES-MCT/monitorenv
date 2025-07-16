package fr.gouv.cacem.monitorenv.infrastructure.cache

import com.github.benmanes.caffeine.cache.Caffeine
import com.github.benmanes.caffeine.cache.Ticker
import fr.gouv.cacem.monitorenv.config.OIDCProperties
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.caffeine.CaffeineCache
import org.springframework.cache.support.SimpleCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.concurrent.TimeUnit

@EnableCaching
@Configuration
class CaffeineConfiguration(
    private val oidcProperties: OIDCProperties,
) {
    val userAuthorization = "user_authorization"
    val controlUnits = "control_units"

    @Bean
    fun cacheManager(ticker: Ticker): CacheManager? {
        val cacheInMinutes = 120

        val userAuthorizationCache = buildMinutesCache(userAuthorization, ticker, cacheInMinutes)
        val controlUnitsCache = buildMinutesCache(controlUnits, ticker, cacheInMinutes)

        val manager = SimpleCacheManager()
        manager.setCaches(
            listOf(
                userAuthorizationCache,
                controlUnitsCache,
            ),
        )

        return manager
    }

    private fun buildMinutesCache(
        name: String,
        ticker: Ticker,
        minutesToExpire: Int,
    ): CaffeineCache =
        CaffeineCache(
            name,
            Caffeine
                .newBuilder()
                .expireAfterWrite(minutesToExpire.toLong(), TimeUnit.MINUTES)
                .recordStats()
                .ticker(ticker)
                .build(),
        )

    private fun buildSecondsCache(
        name: String,
        ticker: Ticker,
        secondsToExpire: Int,
    ): CaffeineCache =
        CaffeineCache(
            name,
            Caffeine
                .newBuilder()
                .expireAfterWrite(secondsToExpire.toLong(), TimeUnit.SECONDS)
                .recordStats()
                .ticker(ticker)
                .build(),
        )

    @Bean
    fun ticker(): Ticker? = Ticker.systemTicker()
}
