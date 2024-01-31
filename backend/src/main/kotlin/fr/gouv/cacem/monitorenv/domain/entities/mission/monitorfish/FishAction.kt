package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import kotlinx.serialization.Serializable

@Serializable
data class FishAction(
    val id: Int? = null,
    val missionId: Int,
    val vesselId: Int? = null,
    val vesselName: String? = null,
    val internalReferenceNumber: String? = null,
    val externalReferenceNumber: String? = null,
    val ircs: String? = null,
    val flagState: String? = null,
    val districtCode: String? = null,
    val faoAreas: List<String> = listOf(),
    val actionType: MissionActionTypeEnum,
    val actionDatetimeUtc: String,
    val emitsVms: ControlCheckEnum? = null,
    val emitsAis: ControlCheckEnum? = null,
    val flightGoals: List<FlightGoalEnum> = listOf(),
    val logbookMatchesActivity: ControlCheckEnum? = null,
    val licencesMatchActivity: ControlCheckEnum? = null,
    val speciesWeightControlled: Boolean? = null,
    val speciesSizeControlled: Boolean? = null,
    val separateStowageOfPreservedSpecies: ControlCheckEnum? = null,
    val logbookInfractions: List<LogbookInfractionEntity> = listOf(),
    val licencesAndLogbookObservations: String? = null,
    val gearInfractions: List<GearInfractionEntity> = listOf(),
    val speciesInfractions: List<SpeciesInfractionEntity> = listOf(),
    val speciesObservations: String? = null,
    val seizureAndDiversion: Boolean? = null,
    val otherInfractions: List<OtherInfractionEntity> = listOf(),
    val numberOfVesselsFlownOver: Int? = null,
    val unitWithoutOmegaGauge: Boolean? = null,
    val controlQualityComments: String? = null,
    val feedbackSheetRequired: Boolean? = null,
    val userTrigram: String? = null,
    val segments: List<FleetSegmentEntity> = listOf(),
    val facade: String? = null,
    val longitude: Double? = null,
    val latitude: Double? = null,
    val portLocode: String? = null,
    // This field is only used when fetching missions
    var portName: String? = null,
    val vesselTargeted: ControlCheckEnum? = null,
    val seizureAndDiversionComments: String? = null,
    val otherComments: String? = null,
    val gearOnboard: List<GearControlEntity> = listOf(),
    val speciesOnboard: List<SpeciesControlEntity> = listOf(),
    var controlUnits: List<ControlUnitEntity> = listOf(),
    var isDeleted: Boolean,
    var hasSomeGearsSeized: Boolean,
    var hasSomeSpeciesSeized: Boolean,
    val isAdministrativeControl: Boolean? = null,
    val isComplianceWithWaterRegulationsControl: Boolean? = null,
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    val isSeafarersControl: Boolean? = null,
) {
    fun verify() {
        val controlTypes = listOf(
            MissionActionTypeEnum.AIR_CONTROL,
            MissionActionTypeEnum.LAND_CONTROL,
            MissionActionTypeEnum.SEA_CONTROL,
        )

        if (controlTypes.any { it == this.actionType }) {
            require(this.vesselId != null) {
                "A control must specify a vessel: the `vesselId` must be given."
            }

            when (this.actionType) {
                MissionActionTypeEnum.AIR_CONTROL -> checkControlPosition()
                MissionActionTypeEnum.SEA_CONTROL -> checkControlPosition()
                MissionActionTypeEnum.LAND_CONTROL -> checkControlPort()
                else -> {}
            }
        }
    }

    private fun checkControlPosition() {
        require(this.longitude != null) {
            "A control must specify a position: the `longitude` must be given."
        }
        require(this.latitude != null) {
            "A control must specify a position: the `latitude` must be given."
        }
        require(this.userTrigram != null) {
            "A control must specify a user trigram: the `userTrigram` must be given."
        }
    }

    private fun checkControlPort() {
        require(this.portLocode != null) {
            "A land control must specify a port: the `portLocode` must be given."
        }
        require(this.userTrigram != null) {
            "A control must specify a user trigram: the `userTrigram` must be given."
        }
    }
}
