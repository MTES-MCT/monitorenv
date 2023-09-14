package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase

@UseCase
class DeleteReportings(private val deleteReporting: DeleteReporting) {
  fun execute(ids: List<Int>) {
    ids.forEach { deleteReporting.execute(it) }
  }
}
