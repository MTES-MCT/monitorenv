package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteControlUnitContactUTests {
    @MockBean
    private lateinit var controlUnitContactRepository: IControlUnitContactRepository

    @Test
    fun `execute should delete control unit contact by its ID`() {
        val controlUnitContactId = 1

        DeleteControlUnitContact(controlUnitContactRepository).execute(controlUnitContactId)

        verify(controlUnitContactRepository).deleteById(controlUnitContactId)
    }
}
