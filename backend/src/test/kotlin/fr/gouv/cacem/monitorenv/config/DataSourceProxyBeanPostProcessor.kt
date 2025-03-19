package fr.gouv.cacem.monitorenv.config

import net.ttddyy.dsproxy.support.ProxyDataSourceBuilder
import org.springframework.beans.BeansException
import org.springframework.beans.factory.config.BeanPostProcessor
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class DataSourceProxyBeanPostProcessor(
    private val customQueryCountListener: CustomQueryCountListener,
) : BeanPostProcessor {
    @Throws(BeansException::class)
    override fun postProcessBeforeInitialization(
        bean: Any,
        beanName: String,
    ): Any? = bean

    @Throws(BeansException::class)
    override fun postProcessAfterInitialization(
        bean: Any,
        beanName: String,
    ): Any? {
        if (bean is DataSource) {
            val listener = customQueryCountListener

            return ProxyDataSourceBuilder
                .create(bean)
                .name("MyDS-Proxy")
                .listener(listener)
                .build()
        }
        return bean
    }
}
