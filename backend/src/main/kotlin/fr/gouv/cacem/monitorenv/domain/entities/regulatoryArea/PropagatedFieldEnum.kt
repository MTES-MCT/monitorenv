package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

/**
 * Fields of a regulatory area group that its regulatory areas (zones) can inherit.
 *
 * A zone inherits a field when the field is in its `inheritedFields`: it then uses the value of the group.
 * The group value is also written in the zone (denormalized), so that every read keeps working on the zone columns.
 * Otherwise the zone uses its own value, possibly empty, and the group never changes it.
 *
 * Regulatory texts are not listed here: they are always inherited from the group when reading a zone.
 */
enum class PropagatedFieldEnum {
    THEMES {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = regulatoryArea.themes.isNotEmpty()

        override fun copy(
            from: PropagatedValuesEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(themes = from.themes)
    },
    TAGS {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = regulatoryArea.tags.isNotEmpty()

        override fun copy(
            from: PropagatedValuesEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(tags = from.tags)
    },
    RESUME {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = !regulatoryArea.resume.isNullOrBlank()

        override fun copy(
            from: PropagatedValuesEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(resume = from.resume)
    },
    AUTHORIZATION_PERIODS {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) =
            !regulatoryArea.authorizationPeriods.isNullOrBlank()

        override fun copy(
            from: PropagatedValuesEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(authorizationPeriods = from.authorizationPeriods)
    },
    PROHIBITION_PERIODS {
        override fun hasData(regulatoryArea: RegulatoryAreaEntity) = !regulatoryArea.prohibitionPeriods.isNullOrBlank()

        override fun copy(
            from: PropagatedValuesEntity,
            to: RegulatoryAreaEntity,
        ) = to.copy(prohibitionPeriods = from.prohibitionPeriods)
    },
    ;

    /** Whether the given regulatory area holds a value for this field. */
    abstract fun hasData(regulatoryArea: RegulatoryAreaEntity): Boolean

    /** Returns [to] with this field replaced by the value of [from]. */
    abstract fun copy(
        from: PropagatedValuesEntity,
        to: RegulatoryAreaEntity,
    ): RegulatoryAreaEntity

    /** Returns [to] inheriting this field from the group: flagged as inherited, with the group value. */
    fun inherit(
        from: PropagatedValuesEntity,
        to: RegulatoryAreaEntity,
    ): RegulatoryAreaEntity = copy(from, to).copy(inheritedFields = (to.inheritedFields + this).distinct().sorted())

    /** Returns [to] no longer inheriting this field: it keeps the last group value as its own value. */
    fun stopInheriting(to: RegulatoryAreaEntity): RegulatoryAreaEntity =
        to.copy(inheritedFields = to.inheritedFields - this)
}
