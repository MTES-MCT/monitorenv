from src.read_query import read_query

def test_dummy(reset_test_data):
    eez_areas = read_query("monitorenv_remote", "SELECT * FROM eez_areas")
    print(eez_areas)
