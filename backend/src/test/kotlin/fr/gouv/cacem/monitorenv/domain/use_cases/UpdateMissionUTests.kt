 package fr.gouv.cacem.monitorenv.domain.use_cases

 import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

 import com.nhaarman.mockitokotlin2.given
 import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
 import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.UpdateMission
 import org.assertj.core.api.Assertions.assertThat
 import org.assertj.core.api.Assertions.catchThrowable
 import org.junit.jupiter.api.Test
 import org.junit.jupiter.api.extension.ExtendWith
 import org.springframework.boot.test.mock.mockito.MockBean
 import org.springframework.test.context.junit.jupiter.SpringExtension
 import java.time.ZonedDateTime

 @ExtendWith(SpringExtension::class)
 class UpdateMissionUTests {

     @MockBean
     private lateinit var missionRepository: IMissionRepository

     @Test
     fun `execute Should throw an exception When no field to update is given`() {
         // When
         val throwable = catchThrowable {
             UpdateMission(missionRepository)
                     .execute(null)
         }

         // Then
         assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
         assertThat(throwable.message).contains("No mission to update")
     }

     @Test
     fun `execute Should return the updated mission When a field to update is given`() {

         // Given
         val firstMission = MissionEntity(0,"SEA", 	"CLOSED", "Outre-Mer","CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),ZonedDateTime.parse("2022-01-23T20:29:03Z"),110.126782000000006,	-50.373736000000001	)
         val expectedUpdatedMission = MissionEntity(0,"LAND", 	"CLOSED", "Outre-Mer","CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),ZonedDateTime.parse("2022-01-23T20:29:03Z"),110.126782000000006,	-50.373736000000001	)
         given(missionRepository.findMissionById(0)).willReturn(
             expectedUpdatedMission
         )

         // When
         val updatedMission = UpdateMission(missionRepository)
                 .execute(expectedUpdatedMission)

         // Then
         assertThat(updatedMission).isEqualTo(expectedUpdatedMission)
     }

 }
