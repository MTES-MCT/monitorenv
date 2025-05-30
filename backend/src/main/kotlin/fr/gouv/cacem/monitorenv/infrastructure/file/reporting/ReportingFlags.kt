package fr.gouv.cacem.monitorenv.infrastructure.file.reporting

import org.springframework.stereotype.Component

@Component
class ReportingFlags {
    fun getReportingFlag(color: String): String =
        """
        <svg xmlns="http://www.w3.org/2000/svg" height="8.4" viewBox="0 0 20 20" width="8.4">
            <rect fill="none" height="20" width="20" />
            <path d="M-143,6.6-155,1V19h2V11.453Z" fill="$color" transform="translate(160)" />
        </svg>
        """.trimIndent()

    fun getArchivedReportingFlag(color: String): String =
        """
         <svg xmlns="http://www.w3.org/2000/svg" height="8.4" viewBox="0 0 26 26" width="8.4">
          <g transform="translate(61 -19)">
            <path d="M-38.9,27.58-54.5,20.3V43.7h2.6V33.889Z" fill="#fff" stroke="$color" stroke-width="1.5" />
            <path d="M-61,19h26V45H-61Z" fill="none" />
            <rect fill="none" height="26" transform="translate(-61 19)" width="26" />
          </g>
        </svg>
        """.trimIndent()
}
