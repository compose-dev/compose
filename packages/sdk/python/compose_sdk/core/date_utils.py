# type: ignore

import datetime
from typing import Union


class DateUtils:
    @staticmethod
    def convert_date(argument: Union[datetime.date, datetime.datetime, None]):
        """
        Convert a python date to our internal date object format.
        """
        if argument is None:
            return None

        if not isinstance(argument, datetime.date) and not isinstance(
            argument, datetime.datetime
        ):
            raise TypeError(
                f"date parameter must be a datetime.date or datetime.datetime, got {type(argument).__name__}"
            )

        return {"day": argument.day, "month": argument.month, "year": argument.year}

    @staticmethod
    def convert_time(argument: Union[datetime.time, datetime.datetime, None]):
        """
        Convert a python time to our internal time object format.
        """
        if argument is None:
            return None

        if not isinstance(argument, datetime.time) and not isinstance(
            argument, datetime.datetime
        ):
            raise TypeError(
                f"time parameter must be a datetime.time or datetime.datetime, got {type(argument).__name__}"
            )

        return {"hour": argument.hour, "minute": argument.minute}

    @staticmethod
    def convert_datetime(argument: Union[datetime.datetime, None]):
        """
        Convert a python datetime to our internal datetime object format.
        """
        if argument is None:
            return None

        if not isinstance(argument, datetime.datetime):
            raise TypeError(
                f"datetime parameter must be a datetime.datetime, got {type(argument).__name__}"
            )

        return {
            "day": argument.day,
            "month": argument.month,
            "year": argument.year,
            "hour": argument.hour,
            "minute": argument.minute,
        }
