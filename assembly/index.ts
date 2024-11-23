import { http } from "@hypermode/modus-sdk-as";
import { JSON } from "json-as";

class StringMap {
  private items: Map<string, string>;

  constructor() {
    this.items = new Map<string, string>();
  }

  set(key: string, value: string): void {
    this.items.set(key, value);
  }

  get(key: string): string | null {
    return this.items.get(key) || null;
  }

  toString(): string {
    return JSON.stringify(Object.fromEntries(this.items));
  }
}

// Core types with proper type definitions
@json
class MockDataTemplate {

  @alias("name")
  name!: string;


  @alias("schema")
  schema!: string;


  @alias("rules")
  rules: StringMap = new StringMap();
}


@json
class GenerationRule {

  @alias("type")
  type!: string;


  @alias("pattern")
  pattern: string = "";


  @alias("min")
  min: i32 = 0;


  @alias("max")
  max: i32 = 100;


  @alias("options")
  options: string[] = [];
}


@json
class MockDataRequest {

  @alias("type")
  type!: string;


  @alias("count")
  count!: i32;


  @alias("format")
  format: string = "json";


  @alias("seed")
  seed: string = "";


  @alias("locale")
  locale: string = "en-US";


  @alias("template")
  template: MockDataTemplate | null = null;
}


@json
class DatasetMetrics {

  @alias("uniqueValues")
  uniqueValues: i32 = 0;


  @alias("nullCount")
  nullCount: i32 = 0;


  @alias("distribution")
  distribution: StringMap = new StringMap();
}

@json
class UserProfile {

  @alias("firstName")
  firstName: string = "";


  @alias("lastName")
  lastName: string = "";


  @alias("dateOfBirth")
  dateOfBirth: string = "";


  @alias("phone")
  phone: string = "";


  @alias("avatar")
  avatar: string = "";
}


@json
class Address {

  @alias("street")
  street: string = "";


  @alias("city")
  city: string = "";


  @alias("state")
  state: string = "";


  @alias("country")
  country: string = "";


  @alias("zipCode")
  zipCode: string = "";
}


@json
class User {

  @alias("id")
  id: string = "";


  @alias("username")
  username: string = "";


  @alias("email")
  email: string = "";


  @alias("profile")
  profile: UserProfile = new UserProfile();


  @alias("address")
  address: Address = new Address();
}

// Helper functions with proper type handling
function generateRandomId(): string {
  return Math.floor(Math.random() * 10000).toString(16);
}

function randomChoice<T>(arr: Array<T>): T {
  const index = Math.floor(Math.random() * arr.length) as i32;
  return arr[index];
}

class MockDataGenerator {
  private seed: string;
  private locale: string;

  constructor(seed: string = "", locale: string = "en-US") {
    this.seed = seed || Date.now().toString();
    this.locale = locale;
  }

  generateUser(): User {
    const firstNames = ["James", "John", "Emma", "Olivia", "William", "Sophia"];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
    ];
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];

    const firstName = randomChoice(firstNames);
    const lastName = randomChoice(lastNames);

    const user = new User();
    user.id = generateRandomId();
    user.username = (firstName + lastName + generateRandomId()).toLowerCase();
    user.email = user.username + "@" + randomChoice(domains);

    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    user.profile.dateOfBirth = this.generateDate();
    user.profile.phone = this.generatePhone();
    user.profile.avatar = `https://avatars.dicebear.com/api/human/${user.username}.svg`;

    user.address.street = "123 Main St";
    user.address.city = "Springfield";
    user.address.state = "IL";
    user.address.country = "USA";
    user.address.zipCode = "62701";

    return user;
  }

  private generateDate(): string {
    const year = 1970 + Math.floor(Math.random() * 30);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  }

  private generatePhone(): string {
    const areaCode = (Math.floor(Math.random() * 800) + 200).toString();
    const prefix = (Math.floor(Math.random() * 900) + 100).toString();
    const lineNum = (Math.floor(Math.random() * 9000) + 1000).toString();
    return `+1 (${areaCode}) ${prefix}-${lineNum}`;
  }
}

// Main mock data generation function
export function generateMockData(request: MockDataRequest): string {
  const generator = new MockDataGenerator(request.seed, request.locale);
  const results: User[] = [];

  for (let i = 0; i < request.count; i++) {
    switch (request.type.toLowerCase()) {
      case "user":
        results.push(generator.generateUser());
        break;
      default:
        throw new Error(`Unsupported data type: ${request.type}`);
    }
  }

  return formatOutput(results, request.format);
}

function formatOutput(data: User[], format: string): string {
  switch (format.toLowerCase()) {
    case "json":
      return JSON.stringify(data);
    case "csv":
      return convertToCSV(data);
    default:
      return JSON.stringify(data);
  }
}

function convertToCSV(data: User[]): string {
  if (data.length === 0) return "";

  const headers = [
    "id",
    "username",
    "email",
    "firstName",
    "lastName",
    "dateOfBirth",
    "phone",
    "street",
    "city",
    "state",
    "country",
    "zipCode",
  ];

  const rows = data.map((user) =>
    [
      user.id,
      user.username,
      user.email,
      user.profile.firstName,
      user.profile.lastName,
      user.profile.dateOfBirth,
      user.profile.phone,
      user.address.street,
      user.address.city,
      user.address.state,
      user.address.country,
      user.address.zipCode,
    ].join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

// GraphQL resolvers
export function mockData(args: MockDataRequest): string {
  try {
    return generateMockData(args);
  } catch (error) {
    throw new Error(`Failed to generate mock data: ${error.message}`);
  }
}

export function getDatasetMetrics(type: string): string {
  const metrics = new DatasetMetrics();
  return JSON.stringify(metrics);
}
