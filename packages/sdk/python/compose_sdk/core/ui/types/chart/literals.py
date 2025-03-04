from typing import Literal

ChartAggregator = Literal["sum", "count", "average", "min", "max"]
ChartBarOrientation = Literal["horizontal", "vertical"]
ChartBarGroupMode = Literal["grouped", "stacked"]
ChartScale = Literal["linear", "symlog"]
