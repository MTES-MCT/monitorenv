package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeNatinfModel.ThemeNatinfPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBThemeNatinfRepository : JpaRepository<ThemeNatinfModel, ThemeNatinfPk>
