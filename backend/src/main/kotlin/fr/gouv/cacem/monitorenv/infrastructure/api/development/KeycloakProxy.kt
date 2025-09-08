package fr.gouv.cacem.monitorenv.infrastructure.api.development

// import org.springframework.cloud.gateway.mvc.ProxyExchange
import fr.gouv.cacem.monitorenv.config.OIDCProperties
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.servlet.function.RouterFunction
import org.springframework.web.servlet.function.ServerResponse
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper

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

//    @Bean
//    fun keycloakProxyRoutes(): RouterFunction<ServerResponse> {
//        return route()
//            .GET("/realms/**") { req -> proxyHandler(req, HttpMethod.GET) }
//            .POST("/realms/**") { req -> proxyHandler(req, HttpMethod.POST) }
//            .GET("/resources/**") { req -> proxyHandler(req, HttpMethod.GET) }
//            .build()
//    }
//
//    private fun proxyHandler(req: ServerRequest, method: HttpMethod): ServerResponse {
//        // Construire l’URL cible
//        val targetUri =
//            oidcProperties.proxyUrl + req.uri().path +
//                    (if (req.uri().query != null) "?" + req.uri().query else "")
//
//        logger.info("[DEV-PROXY] Forwarding ${req.method()} ${req.uri()} → $targetUri")
//
//        // Récupérer le body de la requête entrante (utile pour POST)
//        val bodyBytes = if (method == HttpMethod.POST) req.body(ByteArray::class.java) else null
//
//        // Copier les headers
//        val headers = HttpHeaders()
//        req.headers().asHttpHeaders().forEach { (k, v) -> headers[k] = v }
//
//        val entity = HttpEntity(bodyBytes, headers)
//
//        // Appeler Keycloak
//        val response: ResponseEntity<ByteArray> =
//            restTemplate.exchange(targetUri, method, entity, ByteArray::class.java)
//
//        // Vérifier si c’est du HTML
//        val contentType = response.headers.contentType
//        if (contentType?.toString()?.contains("text/html") == true) {
//            val html = String(response.body ?: ByteArray(0), Charsets.UTF_8)
//
//            val rewrittenHtml = html
//                .replace("http://keycloak:8080", "http://localhost:8880")
//                .replace("action=\"/realms/", "action=\"http://localhost:8880/realms/")
//                .replace("href=\"/realms/", "href=\"http://localhost:8880/realms/")
//                .replace("src=\"/realms/", "src=\"http://localhost:8880/realms/")
//
//            return buildResponse(response, rewrittenHtml.toByteArray(Charsets.UTF_8))
//        }
//
//        // Sinon → renvoyer tel quel
//        return buildResponse(response, response.body ?: ByteArray(0))
//    }
//
//    private fun buildResponse(response: ResponseEntity<ByteArray>, body: ByteArray): ServerResponse {
//        return ServerResponse.status(response.statusCode)
//            .headers { h ->
//                response.headers.forEach { (k, v) ->
//                    if (!k.equals("Content-Length", ignoreCase = true)) {
//                        h.addAll(k, v)
//                    }
//                }
//            }
//            .body(body)
//    }

    @Bean
    fun keycloakProxyRoutesGet(): RouterFunction<ServerResponse> {
        return route("keycloakProxy")
            .GET("/realms/**", http(oidcProperties.proxyUrl))
            .before { request ->
                logger.info(
                    "Proxy request GET before: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, headers=${request.headers()}",
                )
                return@before request
            }.after { request, response ->
                logger.info(
                    "Proxy request GET after: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, headers=${request.headers()}",
                )
                return@after response
            }
            .build()
    }

    @Bean
    fun ressourcesProxyRoutesGet(): RouterFunction<ServerResponse> {
        return route("keycloakProxy")
            .GET("/resources/**", http(oidcProperties.proxyUrl))
            .before { request ->
                logger.info(
                    "Proxy request GET resourcecs before: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, headers=${request.headers()}",
                )
                return@before request
            }
            .after { request, response ->
                logger.info(
                    "Proxy request GET resourcecs after: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, headers=${request.headers()}",
                )
                return@after response
            }
            .build()
    }

//    @Bean
//    fun ressourcesProxyAdminRoutesGet(): RouterFunction<ServerResponse> {
//        return route("keycloakProxy")
//            .GET("/admin/**", http(oidcProperties.proxyUrl))
//            .before { request ->
//                val body = request.body<String>()
//
//                logger.info(
//                    "Proxy request GET admin before: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, body=$body, headers=${request.headers()}",
//                )
//                rewritePath("(?<segment>.*)", "/${'$'}{segment}")
//                return@before request
//            }
//            .after { request, response ->
//                val body = request.body<String>()
//                logger.info(
//                    "Proxy request GET admin after : method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, body=$body, headers=${request.headers()}",
//                )
//                return@after response
//            }
//            .build()
//    }

    @Component
    class KeycloakResponseLoggerFilter : OncePerRequestFilter() {

        private val logger = LoggerFactory.getLogger(KeycloakResponseLoggerFilter::class.java)

        override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain
        ) {
            if (request.requestURI.startsWith("/realms/")) {
                val wrappedResponse = ContentCachingResponseWrapper(response)

                filterChain.doFilter(request, wrappedResponse)

                val body = wrappedResponse.contentAsByteArray.toString(Charsets.UTF_8)
                logger.info(
                    "Keycloak response: status=${wrappedResponse.status}, headers=${
                        wrappedResponse.headerNames.toList().associateWith { wrappedResponse.getHeader(it) }
                    }, body=$body"
                )

                wrappedResponse.copyBodyToResponse()
            } else {
                filterChain.doFilter(request, response)
            }
        }
    }

    @Component
    class KeycloakRequestLoggerFilter : OncePerRequestFilter() {

        private val logger = LoggerFactory.getLogger(KeycloakRequestLoggerFilter::class.java)

        override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain
        ) {
            if (request.requestURI.startsWith("/realms/")) {
                val wrappedRequest = ContentCachingRequestWrapper(request)

                filterChain.doFilter(wrappedRequest, response)

                val body = wrappedRequest.contentAsByteArray.toString(Charsets.UTF_8)
                logger.info(
                    "Keycloak request: method=${wrappedRequest.method}, uri=${wrappedRequest.requestURI}, query=${wrappedRequest.queryString}, headers=${
                        wrappedRequest.headerNames.toList().associateWith { wrappedRequest.getHeader(it) }
                    }, body=$body"
                )
            } else {
                filterChain.doFilter(request, response)
            }
        }
    }

    @Bean
    fun keycloakProxyRoutesPost(): RouterFunction<ServerResponse> {
        return route("keycloakProxy")
            .POST("/realms/**", http(oidcProperties.proxyUrl))
            .before { request ->
                logger.info(
                    "Proxy request POST before: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, headers=${request.headers()}",
                )
                request
            }
            .after { request, response ->
                logger.info(
                    "Proxy request POST after: method=${request.method()}, path=${request.uri().path}, query=${request.uri().query}, headers=${request.headers()}",
                )
                response
            }
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
