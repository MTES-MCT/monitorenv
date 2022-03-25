// package fr.gouv.cacem.monitorenv.infrastructure.api
//
// import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
// import fr.gouv.cacem.monitorenv.domain.use_cases.*
// import fr.gouv.cacem.monitorenv.domain.entities.operations.*
// import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.OperationsController
//
// import org.hamcrest.Matchers.equalTo
// import org.junit.jupiter.api.Test
// import org.junit.jupiter.api.extension.ExtendWith
// import org.mockito.BDDMockito.given
// import org.springframework.beans.factory.annotation.Autowired
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
// import org.springframework.boot.test.mock.mockito.MockBean
// import org.springframework.context.annotation.Import
// import org.springframework.http.MediaType
// import org.springframework.test.context.junit.jupiter.SpringExtension
// import org.springframework.test.web.servlet.MockMvc
// import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
// import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
// import java.time.ZonedDateTime
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
// import com.fasterxml.jackson.databind.ObjectMapper
// import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.UpdateOperationDataInput
// import org.mockito.BDDMockito.any
//
// @Import(MeterRegistryConfiguration::class)
// @ExtendWith(SpringExtension::class)
// @WebMvcTest(value = [(OperationsController::class)])
// class RegulatoryAreasControllerITests {
//
//     @Autowired
//     private lateinit var mockMvc: MockMvc
//
//     @MockBean
//     private lateinit var getRegulatoryAreas: GetRegulatoryAreas
//
//     @MockBean
//     private lateinit var getRegulatoryAreaById: GetRegulatoryAreaById
//
//     @Autowired
//     private lateinit var objectMapper: ObjectMapper
//
//     @Test
//     fun `Should get all regulatory Areas`() {
//         // Given
//         val firstOperation = OperationEntity(0,"SEA", 	"CLOSED", "Outre-Mer","CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),ZonedDateTime.parse("2022-01-23T20:29:03Z"),110.126782000000006,	-50.373736000000001	)
//         given(this.getRegulatoryAreas.execute()).willReturn(listOf(firstOperation))
//
//         // When
//         mockMvc.perform(get("/bff/v1/operations"))
//                 // Then
//                 .andExpect(status().isOk)
//                 .andExpect(jsonPath("$[0].id", equalTo(firstOperation.id)))
//                 .andExpect(jsonPath("$[0].typeOperation", equalTo(firstOperation.typeOperation)))
//                 .andExpect(jsonPath("$[0].statusOperation", equalTo(firstOperation.statusOperation)))
//                 .andExpect(jsonPath("$[0].facade", equalTo(firstOperation.facade)))
//                 .andExpect(jsonPath("$[0].theme", equalTo(firstOperation.theme)))
//                 .andExpect(jsonPath("$[0].inputStartDatetimeUtc", equalTo(firstOperation.inputStartDatetimeUtc.toString())))
//                 .andExpect(jsonPath("$[0].inputEndDatetimeUtc", equalTo(firstOperation.inputEndDatetimeUtc.toString())))
//                 .andExpect(jsonPath("$[0].latitude", equalTo(firstOperation.latitude)))
//                 .andExpect(jsonPath("$[0].longitude", equalTo(firstOperation.longitude)))
//     }
//
//     @Test
//     fun `Should get specific operation when requested by Id` () {
//         // Given
//         val firstOperation = OperationEntity(0,"SEA", 	"CLOSED", "Outre-Mer","CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),ZonedDateTime.parse("2022-01-23T20:29:03Z"),110.126782000000006,	-50.373736000000001	)
//         given(this.getRegulatoryAreaById.execute(0)).willReturn(firstOperation)
//
//         // When
//         mockMvc.perform(get("/bff/v1/operations/0"))
//             // Then
//             .andExpect(status().isOk)
//             .andExpect(jsonPath("$.id", equalTo(firstOperation.id)))
//             .andExpect(jsonPath("$.typeOperation", equalTo(firstOperation.typeOperation)))
//             .andExpect(jsonPath("$.statusOperation", equalTo(firstOperation.statusOperation)))
//             .andExpect(jsonPath("$.facade", equalTo(firstOperation.facade)))
//             .andExpect(jsonPath("$.theme", equalTo(firstOperation.theme)))
//             .andExpect(jsonPath("$.inputStartDatetimeUtc", equalTo(firstOperation.inputStartDatetimeUtc.toString())))
//             .andExpect(jsonPath("$.inputEndDatetimeUtc", equalTo(firstOperation.inputEndDatetimeUtc.toString())))
//             .andExpect(jsonPath("$.latitude", equalTo(firstOperation.latitude)))
//             .andExpect(jsonPath("$.longitude", equalTo(firstOperation.longitude)))
//     }
// }
