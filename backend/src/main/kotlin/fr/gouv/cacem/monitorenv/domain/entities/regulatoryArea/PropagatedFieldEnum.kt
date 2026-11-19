package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

/**
 * Fields of a regulatory area group that can be copied to the regulatory areas (zones) it contains.
 * Regulatory texts are not listed here: they are always inherited from the group when reading a zone.
 */
enum class PropagatedFieldEnum {
    THEMES {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = regulatoryArea.themes.isNotEmpty()

        override fun copy(
            from: RegulatoryAreaEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(themes = from.themes)
    },
    TAGS {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = regulatoryArea.tags.isNotEmpty()

        override fun copy(
            from: RegulatoryAreaEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(tags = from.tags)
    },
    RESUME {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = !regulatoryArea.resume.isNullOrBlank()

        override fun copy(
            from: RegulatoryAreaEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(resume = from.resume)
    },
    AUTHORIZATION_PERIODS {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) =
            !regulatoryArea.authorizationPeriods.isNullOrBlank()

        override fun copy(
            from: RegulatoryAreaEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(authorizationPeriods = from.authorizationPeriods)
    },
    PROHIBITION_PERIODS {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = !regulatoryArea.prohibitionPeriods.isNullOrBlank()

        override fun copy(
            from: RegulatoryAreaEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(prohibitionPeriods = from.prohibitionPeriods)
    },
    ;

    /** Whether the given regulatory area already holds a value for this field. */
    abstract fun hasData(regulatoryArea: RegulatoryAreaEntity): Boolean

    /** Returns [to] with this field replaced by the value of [from]. */
    abstract fun copy(
        from: RegulatoryAreaEntity,
        to: RegulatoryAreaEntity,
    ): RegulatoryAreaEntity
}
