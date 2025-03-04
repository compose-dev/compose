import random
import uuid
from datetime import datetime, timedelta

import pytest

from compose_sdk.core import ComponentInstance as ui, JSON, Compress

favorite_foods = [
    "Pizza",
    "Burger",
    "Pasta",
    "Sushi",
    "Tacos",
    "Salad",
    "Steak",
    "Ice Cream",
    "Chocolate",
    "Sandwich",
    "Soup",
    "Fries",
    "Curry",
    "Dumplings",
    "Ramen",
    "BBQ",
    "Pancakes",
    "Waffles",
    "Cheese",
    "Fruit",
]

favorite_drinks = [
    "Water",
    "Coffee",
    "Tea",
    "Soda",
    "Juice",
    "Milk",
    "Beer",
    "Wine",
    "Whiskey",
    "Vodka",
    "Smoothie",
    "Lemonade",
    "Iced Tea",
    "Hot Chocolate",
    "Milkshake",
    "Energy Drink",
    "Cocktail",
    "Mocktail",
    "Cider",
    "Champagne",
]


def get_random_date(start, end):
    time_between_dates = end - start
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return start + timedelta(days=random_number_of_days)


def get_random_boolean():
    return random.random() < 0.5


def get_random_number(min, max):
    return random.randint(min, max)


def get_random_name():
    first_names = ["John", "Jane", "Alex", "Emily", "Chris", "Katie"]
    last_names = ["Doe", "Smith", "Johnson", "Brown", "Davis", "Miller"]
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return f"{first_name} {last_name}"


def get_random_email():
    domains = ["example.com", "test.com", "sample.com"]
    name = get_random_name().lower().replace(" ", ".")
    domain = random.choice(domains)
    return f"{name}@{domain}"


def create_fake_data(index):
    data_object = {
        "id": str(uuid.uuid4()),
        "name": get_random_name(),
        "email": get_random_email(),
        "age": get_random_number(15, 60),
        "isActive": get_random_boolean(),
        "createdAt": get_random_date(
            datetime.now() - timedelta(days=2 * 365),
            datetime.now() - timedelta(days=30),
        ),
        "data": {
            "favFood": random.choice(favorite_foods),
            "favDrink": random.choice(favorite_drinks),
            "allergies": {
                "peanuts": get_random_boolean(),
                "almonds": get_random_boolean(),
                "cashews": get_random_boolean(),
            },
        },
    }

    if index > 0:
        if index % 5 == 0:
            data_object.pop("email", None)
        elif index % 5 == 1:
            data_object.pop("name", None)
        elif index % 5 == 2:
            data_object.pop("age", None)
        elif index % 5 == 3:
            data_object.pop("createdAt", None)
        elif index % 5 == 4:
            data_object.pop("data", None)

    return data_object


def create_fake_table(rows):
    return [create_fake_data(i) for i in range(rows)]


@pytest.mark.benchmark
def test_compress_10k_rows(benchmark):

    fake_data = create_fake_table(10000)

    layout = ui.table(
        "table",
        fake_data,
    )

    compressed = Compress.ui_tree(layout)

    layout_size_mb = len(JSON.stringify(layout).encode()) / 1024 / 1024
    compressed_size_mb = len(JSON.stringify(compressed).encode()) / 1024 / 1024
    benchmark.extra_info["layout_size_mb"] = layout_size_mb
    benchmark.extra_info["compressed_size_mb"] = compressed_size_mb

    print(f"Layout size: {layout_size_mb:.2f} MB -> {compressed_size_mb:.2f} MB")

    result = benchmark(Compress.ui_tree, layout)


@pytest.mark.benchmark
def test_compress_10k_rows_with_columns_property(benchmark):

    fake_data = create_fake_table(10000)

    layout = ui.table(
        "table",
        fake_data,
        columns=["id", "name", "email", "createdAt"],
    )

    compressed = Compress.ui_tree(layout)

    layout_size_mb = len(JSON.stringify(layout).encode()) / 1024 / 1024
    compressed_size_mb = len(JSON.stringify(compressed).encode()) / 1024 / 1024
    benchmark.extra_info["layout_size_mb"] = layout_size_mb
    benchmark.extra_info["compressed_size_mb"] = compressed_size_mb

    print(f"Layout size: {layout_size_mb:.2f} MB -> {compressed_size_mb:.2f} MB")

    result = benchmark(Compress.ui_tree, layout)


@pytest.mark.benchmark
def test_compress_100k_rows(benchmark):

    fake_data = create_fake_table(100000)

    layout = ui.table(
        "table",
        fake_data,
    )

    compressed = Compress.ui_tree(layout)

    layout_size_mb = len(JSON.stringify(layout).encode()) / 1024 / 1024
    compressed_size_mb = len(JSON.stringify(compressed).encode()) / 1024 / 1024
    benchmark.extra_info["layout_size_mb"] = layout_size_mb
    benchmark.extra_info["compressed_size_mb"] = compressed_size_mb

    print(f"Layout size: {layout_size_mb:.2f} MB -> {compressed_size_mb:.2f} MB")

    result = benchmark(Compress.ui_tree, layout)


@pytest.mark.benchmark
def test_compress_100k_rows_with_columns_property(benchmark):

    fake_data = create_fake_table(100000)

    layout = ui.table(
        "table",
        fake_data,
        columns=["id", "name", "email", "createdAt"],
    )

    compressed = Compress.ui_tree(layout)

    layout_size_mb = len(JSON.stringify(layout).encode()) / 1024 / 1024
    compressed_size_mb = len(JSON.stringify(compressed).encode()) / 1024 / 1024
    benchmark.extra_info["layout_size_mb"] = layout_size_mb
    benchmark.extra_info["compressed_size_mb"] = compressed_size_mb

    print(f"Layout size: {layout_size_mb:.2f} MB -> {compressed_size_mb:.2f} MB")

    result = benchmark(Compress.ui_tree, layout)
