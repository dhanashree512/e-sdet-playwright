# SDET Playwright Framework

A production-quality test automation framework built with **Playwright** and **TypeScript**, covering UI/E2E and API testing.

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | UI & API test automation |
| TypeScript | Type-safe test development |
| Node.js | Runtime environment |
| dotenv | Environment configuration |
| GitHub Actions | CI/CD pipeline |

## 📁 Project Structure
```
e-sdet-playwright/
├── pages/                  # Page Object Models
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CartPage.ts
├── tests/
│   ├── ui/                 # UI / E2E Tests
│   │   ├── login.spec.ts
│   │   └── checkout.spec.ts
│   └── api/                # API Tests
│       └── users.spec.ts
├── fixtures/               # Base fixtures & DI
│   └── baseFixture.ts
├── utils/                  # Test data & helpers
│   └── testData.ts
├── .env                    # Environment variables (not committed)
└── playwright.config.ts    # Playwright configuration
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm

### Install dependencies
```bash
npm install
npx playwright install
```

### Configure environment

Create a `.env` file in the root:
```
BASE_URL=https://www.saucedemo.com
API_BASE_URL=https://jsonplaceholder.typicode.com
```

## 🚀 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run UI tests only
```bash
npx playwright test tests/ui --project=ui-chromium
```

### Run API tests only
```bash
npx playwright test tests/api --project=api
```

### Run in headed mode (visible browser)
```bash
npx playwright test --headed
```

### View HTML report
```bash
npx playwright show-report
```

## 🧪 Test Coverage

### UI / E2E Tests — Sauce Demo
| Test File | Scenarios |
|---|---|
| `login.spec.ts` | Valid login, locked user, invalid credentials, empty fields |
| `checkout.spec.ts` | View inventory, add to cart, multi-item cart, full checkout flow, continue shopping |

### API Tests — JSONPlaceholder
| Test File | Scenarios |
|---|---|
| `users.spec.ts` | GET users list, GET user structure, GET single user, GET 404, POST create, POST type validation, PUT update, DELETE user |

## 🏗 Framework Design

- **Page Object Model (POM)** — encapsulates locators and actions per page
- **Base Fixtures** — injects page objects via `test.extend()` for clean, DRY tests
- **Centralized Test Data** — all users, products, and messages in `testData.ts`
- **CI/CD Aware Config** — retries and workers adjust automatically for CI vs local
- **Failure Artifacts** — screenshots, videos, and traces captured on failure

## 🔄 CI/CD

GitHub Actions workflow is included. Tests run automatically on every push and pull request to `main`.