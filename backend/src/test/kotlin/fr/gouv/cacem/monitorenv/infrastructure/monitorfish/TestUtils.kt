package fr.gouv.cacem.monitorenv.infrastructure.monitorfish

class TestUtils {
    companion object {
        fun getMissionWithAction(): String =
            """[{
                            "id":1,
                            "vesselId":1234,
                            "vesselName":"TY NOEM",
                            "internalReferenceNumber":"12345",
                            "externalReferenceNumber":"12345",
                            "completion":"COMPLETED",
                            "ircs":"FP6588",
                            "flagState":"FR",
                            "districtCode":"SB",
                            "faoAreas":["27.7.e"],
                            "flightGoals":[],
                            "missionId":1,
                            "actionType":"LAND_CONTROL",
                            "actionDatetimeUtc":"2024-01-29T11:15:00Z",
                            "emitsVms":"NOT_APPLICABLE",
                            "emitsAis":"NOT_APPLICABLE",
                            "logbookMatchesActivity":"YES",
                            "licencesMatchActivity":null,
                            "speciesWeightControlled":false,
                            "speciesSizeControlled":false,
                            "separateStowageOfPreservedSpecies":"NOT_APPLICABLE",
                            "logbookInfractions":[],
                            "licencesAndLogbookObservations":"En attente",
                            "gearInfractions":[],
                            "speciesInfractions":[],
                            "speciesObservations":null,
                            "seizureAndDiversion":false,
                            "otherInfractions":[],
                            "numberOfVesselsFlownOver":null,
                            "unitWithoutOmegaGauge":false,
                            "controlQualityComments":null,
                            "feedbackSheetRequired":false,
                            "segments":[{"segment":"FR_SCE","segmentName":"Scallop fisheries"}],
                            "facade":"NAMO",
                            "longitude":null,
                            "latitude":null,
                            "portLocode":"FRQUY",
                            "portName":null,
                            "seizureAndDiversionComments":null,
                            "otherComments":null,
                            "gearOnboard":[{
                                "gearCode":"DRB",
                                "gearName":"Dragues remorquées par bateau",
                                "declaredMesh":97.0,
                                "controlledMesh":97.0,
                                "hasUncontrolledMesh":false,
                                "gearWasControlled":true,
                                "comments":null
                                },{
                                "gearCode":"DRB",
                                "gearName":"Dragues remorquées par bateau",
                                "declaredMesh":97.0,
                                "controlledMesh":97.0,
                                "hasUncontrolledMesh":false,
                                "gearWasControlled":true,
                                "comments":null
                            }],
                            "speciesOnboard":[{
                                "speciesCode":"SCE",
                                "nbFish":null,
                                "declaredWeight":1000.0,
                                "controlledWeight":null,
                                "underSized":false
                            }],
                            "controlUnits":[],
                            "userTrigram":"lsc",
                            "vesselTargeted":"NO",
                            "hasSomeGearsSeized":false,
                            "hasSomeSpeciesSeized":false,
                            "completedBy":null,
                            "isDeleted": false,
                            "isFromPoseidon":false,
                            "isAdministrativeControl":null,
                            "isComplianceWithWaterRegulationsControl":null,
                            "isSafetyEquipmentAndStandardsComplianceControl":null,"isSeafarersControl":null
                        }]"""
    }
}
