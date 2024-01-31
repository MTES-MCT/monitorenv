package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2.NewMissions
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(NewMissions::class)])
class ApiNewMissionsITests {
    @Autowired private lateinit var mockMvc: MockMvc

    @MockBean private lateinit var deleteMission: DeleteMission

    @Test
    fun `Should delete mission with api v2 and source set`() {
        mockMvc.perform(delete("/api/v2/missions/20?source=MONITORFISH"))
            .andExpect(status().isOk)
        Mockito.verify(deleteMission).execute(20, source = MissionSourceEnum.MONITORFISH)
    }

    @Test
    fun `Should not delete mission with api v2 and no source`() {
        mockMvc.perform(delete("/api/v2/missions/20"))
            .andExpect(status().`is`(400))
    }
}
