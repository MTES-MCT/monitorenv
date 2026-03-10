package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemesNatinfRepository
import org.springframework.stereotype.Repository

@Repository
class JpaNatinfRepository(
    private val dbNatinfRepository: IDBNatinfRepository,
    private val dbThemeNatinfRepository: IDBThemesNatinfRepository,
) : INatinfRepository {
    override fun findAll(): List<NatinfEntity> = dbNatinfRepository.findAll().map { it.toNatinf() }

    override fun findAllByThemesIds(ids: List<Int>): List<NatinfEntity> =
        dbThemeNatinfRepository.findAllByThemesIds(ids).map { it.natinf.toNatinf() }

    override fun count(): Long = dbNatinfRepository.count()
}
