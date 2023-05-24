package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import org.springframework.stereotype.Repository

@Repository
class JpaAMPRepository(private val dbAMPRepository: IDBAMPRepository) :
  IAMPRepository {
    override fun findAMPs(): List<AMPEntity> {
        return dbAMPRepository.findAll().map { it.toAMP() }
    }

    override fun count(): Long {
        return dbAMPRepository.count()
    }
}
