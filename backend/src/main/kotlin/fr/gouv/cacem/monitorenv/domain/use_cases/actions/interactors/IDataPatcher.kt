package fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors

import fr.gouv.cacem.monitorenv.domain.entities.PatchableEntity
import kotlin.reflect.KClass

interface IDataPatcher<T : Any> {

    fun execute(entity: T, patchableEntity: PatchableEntity, kClass: KClass<T>): T
}
