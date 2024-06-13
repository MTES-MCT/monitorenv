package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletRequestWrapper
import java.util.*
import kotlin.collections.HashMap
import kotlin.collections.HashSet

internal class MutableHttpServletRequest(request: HttpServletRequest?) : HttpServletRequestWrapper(request) {
    private val customHeaders: MutableMap<String, String>

    init {
        customHeaders = HashMap()
    }

    fun putHeader(name: String, value: String) {
        customHeaders[name] = value
    }

    override fun getHeader(name: String): String {
        // check the custom headers first
        // else return from into the original wrapped object
        val headerValue = customHeaders[name]
        return headerValue ?: (request as HttpServletRequest).getHeader(name)
    }

    override fun getHeaderNames(): Enumeration<String> {
        // create a set of the custom header names
        val set: MutableSet<String> = HashSet(customHeaders.keys)

        // now add the headers from the wrapped request object
        val headersNameEnum = (request as HttpServletRequest).headerNames
        while (headersNameEnum.hasMoreElements()) {
            // add the names of the request headers into the list
            val header = headersNameEnum.nextElement()
            set.add(header)
        }

        // create an enumeration from the set and return
        return Collections.enumeration(set)
    }
}
