const EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "composehq.com",
  "gmail.co.uk",
  "microsoft.com",
  "aol.com",
  "icloud.com",
];

const EMAIL_TYPES = {
  FIRST_NAME_ONLY: "first_name_only",
  LAST_NAME_ONLY: "last_name_only",
  FIRST_NAME_LAST_NAME: "first_name_last_name",
  FIRST_NAME_LAST_INITIAL: "first_name_last_initial",
  FIRST_INITIAL_LAST_NAME: "first_initial_last_name",
  FIRST_NAME_DOT_LAST_NAME: "first_name_dot_last_name",
  FIRST_NAME_LAST_NAME_NUMBER: "first_name_last_name_number",
} as const;

const EMAIL_TYPES_ARRAY = Object.values(EMAIL_TYPES);

type EmailType = (typeof EMAIL_TYPES)[keyof typeof EMAIL_TYPES];

function getRandomEmailDomain() {
  return EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];
}

function getRandomEmailType(): EmailType {
  return EMAIL_TYPES_ARRAY[
    Math.floor(Math.random() * EMAIL_TYPES_ARRAY.length)
  ];
}

function generateEmail(name: { first: string; last: string }) {
  const emailType = getRandomEmailType();
  const domain = getRandomEmailDomain();

  switch (emailType) {
    case EMAIL_TYPES.FIRST_NAME_ONLY:
      return `${name.first}@${domain}`;
    case EMAIL_TYPES.LAST_NAME_ONLY:
      return `${name.last}@${domain}`;
    case EMAIL_TYPES.FIRST_NAME_LAST_NAME:
      return `${name.first}.${name.last}@${domain}`;
    case EMAIL_TYPES.FIRST_NAME_LAST_INITIAL:
      return `${name.first}.${name.last.slice(0, 1)}@${domain}`;
    case EMAIL_TYPES.FIRST_INITIAL_LAST_NAME:
      return `${name.first.slice(0, 1)}.${name.last}@${domain}`;
    case EMAIL_TYPES.FIRST_NAME_DOT_LAST_NAME:
      return `${name.first}.${name.last}@${domain}`;
    case EMAIL_TYPES.FIRST_NAME_LAST_NAME_NUMBER:
      const number = Math.floor(Math.random() * 1000);
      return `${name.first}${name.last}${number}@${domain}`;
  }
}

export { generateEmail };
