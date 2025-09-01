package fr.gouv.cacem.monitorenv.infrastructure.api.development

// import org.springframework.cloud.gateway.mvc.ProxyExchange
import fr.gouv.cacem.monitorenv.config.OIDCProperties
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.rewritePath
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http
import org.springframework.context.annotation.Bean
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.function.RouterFunction
import org.springframework.web.servlet.function.ServerResponse

/**
 * ⚠️ DEVELOPMENT ONLY - Keycloak Authentication Proxy
 *
 * This controller is ONLY used for local development and E2E testing.
 * It provides a proxy between the MonitorEnv application and a Keycloak server
 * to handle authentication flows during development.
 *
 * ❌ This controller is NEVER enabled in production environments.
 * ✅ Only activated when `monitorenv.keycloak.proxy.enabled=true`
 *
 * Purpose:
 * - Local development authentication testing
 * - E2E/Cypress test authentication flows
 * - URL rewriting for localhost development environment
 *
 * @see fr.gouv.cacem.monitorenv.config.KeycloakProxyProperties for configuration
 */
@RestController
@ConditionalOnProperty(
    value = ["monitorenv.keycloak.proxy.enabled"],
    havingValue = "true",
    matchIfMissing = false,
)
class KeycloakProxyController(
    private val oidcProperties: OIDCProperties,
) {
    private val logger: Logger = LoggerFactory.getLogger(KeycloakProxyController::class.java)

    init {
        logger.warn(
            """
            ⚠️ DEVELOPMENT ONLY: Keycloak Proxy Controller is ACTIVE
            This controller should NEVER be enabled in production!
            Current configuration: monitorfish.keycloak.proxy.enabled=true
            """.trimIndent(),
        )
    }

    @Bean
    fun keycloakProxyRoutesGet(): RouterFunction<ServerResponse> {
        logger.info("USING ROUTER PROXY")
        return route("keycloakProxy")
            .GET("/realms/**", http(oidcProperties.proxyUrl))
            .before { req ->

                logger.info(
                    "Proxy request GET: method=${req.method()}, path=${req.uri().path}, query=${req.uri().query}",
                )
                rewritePath("(?<segment>.*)", "/${'$'}{segment}")
                return@before req
            }.build()
    }

    @Bean
    fun ressourcesProxyRoutesGet(): RouterFunction<ServerResponse> {
        return route("keycloakProxy")
            .GET("/ressources/**", http(oidcProperties.proxyUrl))
            .before { req ->

                logger.info(
                    "Proxy request GET: method=${req.method()}, path=${req.uri().path}, query=${req.uri().query}",
                )
                rewritePath("(?<segment>.*)", "/${'$'}{segment}")
                return@before req
            }.build()
    }

    @Bean
    fun keycloakProxyRoutesPost(): RouterFunction<ServerResponse> {
        return route("keycloakProxy")
            .POST("/realms/**", http(oidcProperties.proxyUrl))
            .before { req ->

                logger.info(
                    "Proxy request POST: method=${req.method()}, path=${req.uri().path}, query=${req.uri().query}",
                )
                return@before req
            }.before(rewritePath("(?<segment>.*)", "/${'$'}{segment}"))
            .build()
    }

    /**
     * ⚠️ DEVELOPMENT ONLY - Proxy GET requests to Keycloak realms
     *
     * Forwards authentication page requests to the Keycloak server
     * and rewrites HTML responses to fix URLs for local development.
     */
//    @GetMapping("/realms/**")
//    @Throws(Exception::class)
//    fun get(
//        proxy: ProxyExchange<ByteArray?>,
//        request: HttpServletRequest,
//    ): ResponseEntity<*> {
//        val targetUri = StringBuilder("${oidcProperties.proxyUrl}${request.requestURI}?${request.queryString}")
//        logger.info("[DEV-PROXY] Forwarding ${request.requestURI} to $targetUri")
//
//        // TODO Use properties to pass all sensitive headers
//        // @see https://docs.spring.io/spring-cloud-gateway/reference/appendix.html
//        // NOTE: This is acceptable for development/testing only
//        val headerNames = request.headerNames
//        while (headerNames.hasMoreElements()) {
//            val headerName = headerNames.nextElement()
//            if (!headerName.isNullOrBlank()) {
//                val headerValues = request.getHeaders(headerName)
//                while (headerValues.hasMoreElements()) {
//                    proxy.header(headerName, headerValues.nextElement())
//                }
//            }
//        }
//
//        val response = proxy.uri(targetUri.toString()).get()
//
//        // Rewrite HTML responses to fix form action URLs
//        return if (isHtmlResponse(response)) {
//            rewriteHtmlResponse(response)
//        } else {
//            response
//        }
//    }

//    /**
//     * ⚠️ DEVELOPMENT ONLY - Proxy GET requests for Keycloak resources
//     *
//     * Forwards requests for Keycloak static resources (CSS, JS, images)
//     * to the Keycloak server for local development.
//     */
//    @GetMapping("/resources/**")
//    @Throws(Exception::class)
//    fun getResources(
//        proxy: ProxyExchange<ByteArray?>,
//        request: HttpServletRequest,
//    ): ResponseEntity<*> {
//        val targetUri = "${oidcProperties.proxyUrl}${request.requestURI}"
//
//        return proxy.uri(targetUri).get()
//    }

    /**
     * ⚠️ DEVELOPMENT ONLY - Proxy POST requests to Keycloak realms
     *
     * Forwards form submissions (login, logout, etc.) to the Keycloak server
     * and rewrites HTML responses to fix URLs for local development.
     */
//    @PostMapping(
//        value = ["/realms/**"],
//        consumes = ["application/x-www-form-urlencoded", "application/x-www-form-urlencoded;charset=UTF-8"],
//    )
//    @Throws(Exception::class)
//    fun post(
//        proxy: ProxyExchange<ByteArray?>,
//        request: HttpServletRequest,
//    ): ResponseEntity<*> {
//        val params = request.parameterMap
//        val targetUri = StringBuilder("${oidcProperties.proxyUrl}${request.requestURI}?${request.queryString}")
//        logger.info("[DEV-PROXY] Forwarding ${request.requestURI} to $targetUri")
//
//        // TODO Use properties to pass all sensitive headers
//        // @see https://docs.spring.io/spring-cloud-gateway/reference/appendix.html
//        // NOTE: This is acceptable for development/testing only
//        val headerNames = request.headerNames
//        while (headerNames.hasMoreElements()) {
//            val headerName = headerNames.nextElement()
//            if (!headerName.isNullOrBlank()) {
//                val headerValues = request.getHeaders(headerName)
//                while (headerValues.hasMoreElements()) {
//                    proxy.header(headerName, headerValues.nextElement())
//                }
//            }
//        }
//
//        // TODO Use properties to pass form data
//        // @see spring.cloud.gateway.mvc.form-filter.enabled=false
//        // NOTE: This is acceptable for development/testing only
//        val formData = StringBuilder()
//        if (params.isNotEmpty()) {
//            params.entries
//                .joinToString("&") { (key, values) ->
//                    "$key=${values.joinToString(",")}"
//                }.let { formData.append(it) }
//        }
//
//        val formDataBytes = formData.toString().toByteArray(StandardCharsets.UTF_8)
//
//        val cookieHeader = request.getHeader("Cookie")
//        if (!cookieHeader.isNullOrBlank()) {
//            proxy.header("Cookie", cookieHeader)
//        }
//        // Ensure the content length matches the size of the byte array
//        proxy
//            .header("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE)
//            .header("Content-Length", formDataBytes.size.toString())
//            .header("Access-Control-Expose-Headers", "Set-Cookie")
//        val response = proxy.uri(targetUri.toString()).body(formDataBytes).post()
//
//        // Rewrite HTML responses to fix form action URLs
//        return if (isHtmlResponse(response)) {
//            rewriteHtmlResponse(response)
//        } else {
//            response
//        }
//    }
//
//    private fun isHtmlResponse(response: ResponseEntity<*>): Boolean {
//        val contentType = response.headers.contentType
//        return contentType?.toString()?.contains("text/html") == true
//    }
//
//    private fun rewriteHtmlResponse(response: ResponseEntity<*>): ResponseEntity<*> {
//        try {
//            val body = response.body as? ByteArray ?: return response
//            val html = String(body, StandardCharsets.UTF_8)
//
//            // Replace Keycloak internal URLs with proxy URLs for local development
//            val rewrittenHtml =
//                html
//                    .replace("http://keycloak:8080", "http://localhost:8880")
//                    .replace("action=\"/realms/", "action=\"http://localhost:8880/realms/")
//                    .replace("href=\"/realms/", "href=\"http://localhost:8880/realms/")
//                    .replace("src=\"/realms/", "src=\"http://localhost:8880/realms/")
//
//            val rewrittenBody = rewrittenHtml.toByteArray(StandardCharsets.UTF_8)
//
//            // Create new headers without Content-Length (Spring will set it automatically)
//            val newHeaders = response.headers.toMutableMap()
//            newHeaders.remove("Content-Length")
//
//            return ResponseEntity
//                .status(response.statusCode)
//                .headers { headers ->
//                    newHeaders.forEach { (key, values) ->
//                        headers.addAll(key, values)
//                    }
//                }.body(rewrittenBody)
//        } catch (e: Exception) {
//            logger.error("Error rewriting HTML response", e)
//            return response
//        }
//    }
}
