package fr.gouv.cacem.monitorenv.config

import org.apache.catalina.connector.Connector
import org.apache.coyote.ajp.AbstractAjpProtocol
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.net.InetAddress

@Configuration
class AJPConfig {
    @Autowired
    private val ajpProperties: AJPProperties? = null

    @Bean
    fun servletContainer(): TomcatServletWebServerFactory {
        val factory = TomcatServletWebServerFactory()
        factory.addAdditionalConnectors(redirectConnector())
        return factory
    }

    private fun redirectConnector(): Connector {
        val connector = Connector("AJP/1.3")
        connector.scheme = "http"
        connector.port = ajpProperties?.port?.toInt() ?: 8000
        connector.secure = false
        connector.allowTrace = false
        (connector.protocolHandler as AbstractAjpProtocol<*>).secretRequired = false
        (connector.protocolHandler as AbstractAjpProtocol<*>).address = InetAddress.getByName("0.0.0.0")

        return connector
    }
}
