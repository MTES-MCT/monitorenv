package fr.gouv.cacem.monitorenv.domain.mappers

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.Patchable
import java.util.*
import kotlin.reflect.KMutableProperty
import kotlin.reflect.full.hasAnnotation
import kotlin.reflect.full.memberProperties

@UseCase
class PatchEntity<T : Any, S : Any> {

    fun execute(target: T, source: S): T {
        val sourceProperties = source::class.memberProperties
        val targetProperties = target::class.memberProperties

        for (sourceProp in sourceProperties) {
            val targetProp =
                targetProperties.filter { it.hasAnnotation<Patchable>() }.find { it.name == sourceProp.name }
            if (targetProp != null && targetProp is KMutableProperty<*>) {
                val sourceValue = sourceProp.getter.call(source)
                val existingValue = targetProp.getter.call(target)
                val finalValue = if (sourceValue is Optional<*>) {
                    getValueFromOptional(existingValue, sourceValue)
                } else {
                    sourceValue
                }

                targetProp.setter.call(target, finalValue)
            }
        }

        return target
    }

    private fun getValueFromOptional(existingValue: Any?, optional: Optional<*>?): Any? {
        return when {
            optional == null -> existingValue
            optional.isPresent -> optional.get()
            else -> null
        }
    }
}
