import uuid


class Utils:
    @staticmethod
    def generate_id() -> str:
        return str(uuid.uuid4())
