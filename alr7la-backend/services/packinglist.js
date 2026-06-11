function getPackingList(days, maxTemp, minTemp, activities) {
    const packingList = {};

    // Essentials for any trip
    packingList["Clothes"] = {
        "T-Shirts": days,
        "Pants": Math.ceil(days / 3),
        "Shorts": maxTemp > 25 ? Math.ceil(days / 2) : 0,
        "Underwear": days,
        "Socks": days,
        "Jacket": minTemp < 15 ? 1 : 0,
        "Swimwear": activities.includes("swimming") ? 1 : 0,
    };

    // Footwear based on activities
    packingList["Footwear"] = {
        "Casual Shoes": 1,
        "Hiking Boots": activities.includes("hiking") ? 1 : 0,
        "Sandals": maxTemp > 20 ? 1 : 0,
        "Flip Flops": 1,
    };

    // Activity-specific items
    if (activities.includes("camping")) {
        packingList["Camping Gear"] = {
            "Tent": 1,
            "Sleeping Bag": 1,
            "Flashlight": 1,
            "Fire Starter": 1,
        };
    }

    if (activities.includes("swimming")) {
        packingList["Swimming Gear"] = {
            "Towel": 1,
            "Goggles": 1,
        };
    }

    // Toiletries
    packingList["Toiletries"] = {
        "Toothbrush": 1,
        "Hairbrush": 1,
        "Deodorant": 1,
        "Toothpaste": 1,
        "Shampoo": 1,
        "Soap": 1,
    };

    // Miscellaneous
    packingList["Miscellaneous"] = {
        "Sunscreen": maxTemp > 20 ? 1 : 0,
        "Hat": maxTemp > 20 ? 1 : 0,
        "Gloves": minTemp < 10 ? 1 : 0,
        "Scarf": minTemp < 10 ? 1 : 0,
    };

    packingList["Documents"] = {
        "Passport": 1,
        "Travel Insurance": 1,
        "Tickets": 1,
        "Emergency Contacts": 1,
    };

    packingList["Electronics"] = {
        "Phone": 1,
        "Phone Charger": 1,
        "Camera": 1,
        "Power Bank": 1,
        "Headphones": 1,
    };

    return packingList;
}

module.exports = getPackingList;