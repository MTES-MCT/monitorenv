 package fr.gouv.cacem.monitorenv.domain.use_cases

 import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository

 import com.nhaarman.mockitokotlin2.given
 import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
 import org.assertj.core.api.Assertions.assertThat
 import org.assertj.core.api.Assertions.catchThrowable
 import org.junit.jupiter.api.Test
 import org.junit.jupiter.api.extension.ExtendWith
 import org.springframework.boot.test.mock.mockito.MockBean
 import org.springframework.test.context.junit.jupiter.SpringExtension
 import java.time.ZonedDateTime

 @ExtendWith(SpringExtension::class)
 class UpdateOperationUTests {

     @MockBean
     private lateinit var operationRepository: IOperationRepository

     @MockBean
     private lateinit var getOperationById: GetOperationById

     @Test
     fun `execute Should throw an exception When no field to update is given`() {
         // When
         val throwable = catchThrowable {
             UpdateOperation(operationRepository, getOperationById)
                     .execute(null)
         }

         // Then
         assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
         assertThat(throwable.message).contains("No operation to update")
     }

     @Test
     fun `execute Should return the updated operation When a field to update is given`() {

         // Given
         val firstOperation = OperationEntity(0,"SEA", 	"CLOSED", "Outre-Mer","CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),ZonedDateTime.parse("2022-01-23T20:29:03Z"),110.126782000000006,	-50.373736000000001	)
         val expectedUpdatedOperation = OperationEntity(0,"LAND", 	"CLOSED", "Outre-Mer","CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),ZonedDateTime.parse("2022-01-23T20:29:03Z"),110.126782000000006,	-50.373736000000001	)
         given(operationRepository.findOperationById(0)).willReturn(
             firstOperation
         )
         given(getOperationById.execute(0))
                 .willReturn(expectedUpdatedOperation)

         // When
         val updatedOperation = UpdateOperation(operationRepository, getOperationById)
                 .execute(expectedUpdatedOperation)

         // Then
         assertThat(updatedOperation).isEqualTo(expectedUpdatedOperation)
     }

 }
