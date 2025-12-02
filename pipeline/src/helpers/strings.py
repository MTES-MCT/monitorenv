import re


def to_snake_case(s: str) -> str:
    # Exemple : "DateOfInformation" -> "date_of_information"
    #           "IMONumber" -> "imo_number"
    #           "ShipID" -> "ship_id"

    # Insere un _ avant une majuscule suivie d’une minuscule
    s = re.sub(r"(?<=[a-z0-9])([A-Z])", r"_\1", s)

    # Gestion des acronymes
    s = re.sub(r"([A-Z])([A-Z][a-z])", r"\1_\2", s)

    # Remplace espaces et caractères non alphanumériques
    s = re.sub(r"\W+", "_", s)

    return s.lower().strip("_")
