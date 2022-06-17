package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.domain.use_cases.crud.infractions.GetInfractions
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.InfractionDataOutput
import io.micrometer.core.instrument.MeterRegistry
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/infractions")
@Tag(description = "API Infractions", name = "Infractions")
class InfractionsController(
    private val getInfractions: GetInfractions,
    meterRegistry: MeterRegistry
  ) {

    @GetMapping("")
    @Operation(summary = "Get infractions")
    fun getInfractionsController(): List<InfractionDataOutput> {
      val infractions = getInfractions.execute()

      return infractions.map { InfractionDataOutput.fromInfractionEntity(it) }
    }
}
