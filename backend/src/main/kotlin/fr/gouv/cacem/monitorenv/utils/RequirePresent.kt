package fr.gouv.cacem.monitorenv.utils

import java.util.Optional

fun <T : Any> requirePresent(value: Optional<T>): T =
        if (value.isPresent) {
            value.get()
        } else {
            throw IllegalArgumentException("This Optional value is unexpectedly empty.")
        }
