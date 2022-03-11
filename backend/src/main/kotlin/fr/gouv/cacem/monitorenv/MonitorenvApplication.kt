package fr.gouv.cacem.monitorenv

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MonitorenvApplication

fun main(args: Array<String>) {
	runApplication<MonitorenvApplication>(*args)
}
