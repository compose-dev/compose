import { useState } from "react";
import { JsonEditor } from "~/components/code-editor";

const EXAMPLE_JSON = {
  users: [
    {
      id: 1,
      firstName: "Emily",
      lastName: "Johnson",
      maidenName: "Smith",
      age: 28,
      gender: "female",
      email: "emily.johnson@x.dummyjson.com",
      phone: "+81 965-431-3024",
      username: "emilys",
      password: "emilyspass",
      birthDate: "1996-5-30",
      image: "...",
      bloodGroup: "O-",
      height: 193.24,
      weight: 63.16,
      eyeColor: "Green",
      hair: {
        color: "Brown",
        type: "Curly",
      },
      ip: "42.48.100.32",
      address: {
        address: "626 Main Street",
        city: "Phoenix",
        state: "Mississippi",
        stateCode: "MS",
        postalCode: "29112",
        coordinates: {
          lat: -77.16213,
          lng: -92.084824,
        },
        country: "United States",
      },
      macAddress: "47:fa:41:18:ec:eb",
      university: "University of Wisconsin--Madison",
      bank: {
        cardExpire: "03/26",
        cardNumber: "9289760655481815",
        cardType: "Elo",
        currency: "CNY",
        iban: "YPUXISOBI7TTHPK2BR3HAIXL",
      },
      company: {
        department: "Engineering",
        name: "Dooley, Kozey and Cronin",
        title: "Sales Manager",
        address: {
          address: "263 Tenth Street",
          city: "San Francisco",
          state: "Wisconsin",
          stateCode: "WI",
          postalCode: "37657",
          coordinates: {
            lat: 71.814525,
            lng: -161.150263,
          },
          country: "United States",
        },
      },
      ein: "977-175",
      ssn: "900-590-289",
      crypto: {
        coin: "Bitcoin",
        wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
        network: "Ethereum (ERC20)",
      },
      role: "admin",
    },
  ],
  total: 208,
  skip: 0,
  limit: 30,
};

function Json() {
  const [value, setValue] = useState<string | null>(
    JSON.stringify(EXAMPLE_JSON, null, 2)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    try {
      if (newValue !== null) {
        JSON.parse(newValue);
      }
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        `Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    setValue(newValue);
  };

  return (
    <div className="p-4">
      <JsonEditor
        id="json-editor"
        label="User data"
        value={value}
        onChange={handleChange}
        description={null}
        errorMessage={errorMessage}
        hasError={errorMessage !== null}
        inputStyle={{ height: "70vh" }}
      />
    </div>
  );
}

export { Json };
