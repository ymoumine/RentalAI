""" Contains all queries to the Realtor.ca API and OpenStreetMap."""
import requests


def get_coordinates(city):
    """Gets the coordinate bounds of a city from OpenStreetMap."""

    # Ottawa,ON to Ottawa, ON
    city = city.replace(',', ', ')

    url = "https://nominatim.openstreetmap.org/search?q=" + city + "&format=json"
    response = requests.get(url=url, timeout=10)
    response.raise_for_status()
    data = response.json()

    print(data)
    for response in data:
        if (response["class"] == "boundary" and
                response["type"] == "administrative"):
            return response["boundingbox"]  # [latMin, latMax, lonMin, lonMax]
    return data


# pylint: disable=too-many-arguments
def get_property_list(lat_min, lat_max, long_min, long_max, building_type, current_page):
    """Queries the Realtor.ca API to get a list of properties."""

    url = "https://api2.realtor.ca/Listing.svc/PropertySearch_Post"
    headers = {"Referer": "https://www.realtor.ca/",
               "Origin": "https://www.realtor.ca/",
               "Host": "api2.realtor.ca"}

    form = {
        "LatitudeMin": lat_min,
        "LatitudeMax": lat_max,
        "LongitudeMin": long_min,
        "LongitudeMax": long_max,
        "CultureId": 1,  # for EN
        "ApplicationId": 1,  # Unused
        "PropertySearchTypeId": 0,  # No Preference for type of property
        "TransactionTypeId": 3,  # for rent
        "BuildingTypeId": building_type,
        "CurrentPage": current_page
    }

    response = requests.post(url=url, headers=headers, data=form, timeout=10)
    if response.status_code == 403:
        print("Error 403: Rate limited")
    elif response.status_code != 200:
        print("Error " + str(response.status_code))
    response.raise_for_status()
    return response.json()


def get_property_details(property_id, mls_reference_number):
    """Queries the Realtor.ca API to get details of a property."""

    baseurl = "https://api2.realtor.ca/Listing.svc/PropertyDetails?ApplicationId=1&CultureId=1"
    url = baseurl + "&PropertyID=" + property_id + "&ReferenceNumber=" + mls_reference_number

    headers = {"Referer": "https://www.realtor.ca/",
               "Origin": "https://www.realtor.ca/",
               "Host": "api2.realtor.ca"}
    response = requests.get(url=url, headers=headers, timeout=10)
    if response.status_code == 403:
        print("Error 403: Rate limited")
    elif response.status_code != 200:
        print("Error " + str(response.status_code))
    response.raise_for_status()
    return response.json()
