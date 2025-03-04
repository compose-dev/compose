from io import BytesIO


class File(BytesIO):
    def __init__(self, content: bytes, file_name: str, file_type: str):
        super().__init__(content)
        self.name = file_name
        self.type = file_type
