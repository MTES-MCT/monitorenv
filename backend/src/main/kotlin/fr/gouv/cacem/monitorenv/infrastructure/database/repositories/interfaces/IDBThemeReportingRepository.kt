package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeReportingPk
import org.springframework.data.jpa.repository.JpaRepository

interface IDBThemeReportingRepository : JpaRepository<ThemeReportingModel, ThemeReportingPk>
