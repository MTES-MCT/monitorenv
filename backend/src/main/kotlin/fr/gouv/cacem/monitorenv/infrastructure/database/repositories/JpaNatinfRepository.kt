package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RefNatinfModel.Companion.fromRefNatinfEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeModel.Companion.fromThemeEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel.Companion.toNatinfEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel.ThemeNatinfPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeNatinfRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaNatinfRepository(
    private val dbNatinfRepository: IDBNatinfRepository,
    private val dbThemeNatinfRepository: IDBThemeNatinfRepository,
) : INatinfRepository {
    override fun findAll(): List<NatinfEntity> = dbNatinfRepository.findAll().map { it.toNatinf() }

    override fun count(): Long = dbNatinfRepository.count()

    @Transactional
    override fun save(
        natinf: fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity,
    ): fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity {
        val refNatinf = fromRefNatinfEntity(natinf.refNatinf)
        val themeNatinf =
            dbThemeNatinfRepository.saveAll(
                natinf.themes.map {
                    ThemeNatinfModel(
                        id =
                            ThemeNatinfPk(
                                themeId = it.id,
                                refNatinfId = natinf.refNatinf.id,
                            ),
                        theme = fromThemeEntity(it),
                        refNatinf = refNatinf,
                    )
                },
            )

        return toNatinfEntity(themesNatinfs = themeNatinf, refNatinf = refNatinf)
    }
}
