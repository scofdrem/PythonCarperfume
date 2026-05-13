# Testing Plan and Functionality Map for PythonAromas Application

## Table of Contents
1. [Application Overview](#application-overview)
2. [Functionality Map](#functionality-map)
3. [Backend Testing Plan](#backend-testing-plan)
4. [Frontend Testing Plan](#frontend-testing-plan)
5. [Browser Verification Plan](#browser-verification-plan)
6. [Running Tests](#running-tests)

---

## Application Overview

PythonAromas is a web application for managing and exploring aroma/fragrance data with user authentication, ratings, and personalized recommendations.

---

## Functionality Map

```
PythonAromas Application
├── Backend (Flask API)
│   ├── Authentication Module
│   │   ├── User Registration (/api/auth/register)
│   │   ├── User Login (/api/auth/login)
│   │   ├── Token Management
│   │   └── Password Hashing
│   │
│   ├── Aroma Management Module
│   │   ├── List All Aromas (GET /api/aromas)
│   │   ├── Search Aromas (GET /api/aromas?search=query)
│   │   ├── Get Aroma Details (GET /api/aromas/:id)
│   │   ├── Create Aroma (POST /api/aromas)
│   │   ├── Update Aroma (PUT /api/aromas/:id)
│   │   └── Delete Aroma (DELETE /api/aromas/:id)
│   │
│   ├── Category Module
│   │   ├── List Categories (GET /api/categories)
│   │   ├── Get Category (GET /api/categories/:id)
│   │   └── Create Category (POST /api/categories)
│   │
│   ├── Rating Module
│   │   ├── Create Rating (POST /api/ratings)
│   │   ├── Get User Ratings (GET /api/ratings/user)
│   │   └── Update/Delete Rating
│   │
│   ├── Recommendation Module
│   │   ├── Get Personalized Recommendations (GET /api/recommendations)
│   │   └── Mark Recommendation Viewed
│   │
│   ├── Note Module
│   │   ├── List Notes (GET /api/notes)
│   │   └── Get Notes by Category
│   │
│   └── Health Check
│       └── Health Endpoint (GET /api/health)
│
├── Frontend (React + TypeScript)
│   ├── Pages
│   │   ├── Homepage (/)
│   │   ├── Aromas List (/aromas)
│   │   ├── Aroma Detail (/aromas/:id)
│   │   ├── Login (/login)
│   │   ├── Register (/register)
│   │   └── User Profile (/profile)
│   │
│   ├── Components
│   │   ├── Navigation
│   │   ├── AromaCard
│   │   ├── SearchBar
│   │   ├── RatingDisplay
│   │   └── Forms
│   │
│   └── Features
│       ├── Browse Aromas
│       ├── Search & Filter
│       ├── User Authentication
│       └── Responsive Design
│
└── Database Models
    ├── User
    ├── Aroma
    ├── AromaCategory
    ├── UserRating
    ├── Recommendation
    ├── Note
    └── NoteCategory
```

---

## Backend Testing Plan

### Unit Tests (`app/backend/tests/unit/`)

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `test_models.py` | Model creation, serialization, validation | User, Aroma, Category, Rating, Recommendation, Note models |

### Integration Tests (`app/backend/tests/integration/`)

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `test_api.py` | API endpoints, request/response, error handling | Health, Auth, Aroma, Rating, Recommendation, Note endpoints |

### Test Categories

#### 1. Authentication Tests
- User registration with valid/invalid data
- Duplicate email handling
- Login success/failure
- Invalid credentials handling
- Token generation and validation

#### 2. Aroma CRUD Tests
- Create aroma with valid/missing data
- Retrieve single aroma
- List all aromas
- Search aromas by query
- Update aroma details
- Delete aroma
- Handle non-existent resources

#### 3. Rating Tests
- Create rating with valid/invalid values
- Rating constraints (0-5 range)
- Retrieve user ratings

#### 4. Recommendation Tests
- Get recommendations for user
- Filter by score threshold

#### 5. Category Tests
- List all categories
- Get category details

#### 6. Health Check Tests
- Health endpoint response
- Status verification

---

## Frontend Testing Plan

### E2E Tests (`app/frontend/tests/e2e/`)

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `app.spec.ts` | Full application flow, UI interactions | Homepage, Aromas, Auth, Details, Responsive, Accessibility, API integration |

### Test Categories

#### 1. Homepage Tests
- Page load success
- Navigation visibility
- Hero section display
- Navigation link functionality

#### 2. Aroma Browsing Tests
- Navigate to aromas page
- Display aroma cards
- Search functionality
- Search filtering

#### 3. Authentication Tests
- Login page navigation
- Register page navigation
- Login form display
- Form validation errors

#### 4. Aroma Detail Tests
- Navigate to detail page
- Display aroma details
- Rating section visibility

#### 5. Responsive Design Tests
- Mobile viewport (375x667)
- Mobile navigation menu

#### 6. Accessibility Tests
- Heading hierarchy (single h1)
- Image alt text presence

#### 7. API Integration Tests
- Backend API communication
- Error handling

---

## Browser Verification Plan

### Browser Support Matrix

| Browser | Version | OS | Status |
|---------|--------|-----|--------|
| Chrome | Latest | Windows/macOS/Linux | Required |
| Firefox | Latest | Windows/macOS/Linux | Required |
| Safari | Latest | macOS | Optional |
| Edge | Latest | Windows | Recommended |

### Manual Verification Checklist

1. **Application Load**
   - [ ] Open browser at `http://localhost:8080`
   - [ ] Verify homepage loads within 5 seconds
   - [ ] Check for any console errors

2. **Navigation**
   - [ ] All navigation links work
   - [ ] Mobile menu toggles correctly
   - [ ] Active page indicator visible

3. **Functionality**
   - [ ] Search returns results
   - [ ] Forms submit correctly
   - [ ] Rating display updates

4. **Responsive Design**
   - [ ] Desktop view (1920x1080)
   - [ ] Tablet view (768x1024)
   - [ ] Mobile view (375x667)

5. **Visual Checkpoints**
   - [ ] Logo/branding visible
   - [ ] Cards/images load properly
   - [ ] Typography readable
   - [ ] Colors match design

---

## Running Tests

### Backend Tests

```bash
# Navigate to backend directory
cd app/backend

# Run all tests
python tests/run_tests.py

# Run unit tests only
python tests/run_tests.py --unit

# Run integration tests only
python tests/run_tests.py --integration

# Run with coverage
python tests/run_tests.py --coverage
```

### Frontend Tests (Playwright)

```bash
# Navigate to frontend directory
cd app/frontend

# Install dependencies (if needed)
npm install

# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/app.spec.ts

# Run with headed browser (visible)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

### Quick Verification Commands

```bash
# Backend health check
curl http://localhost:5000/api/health

# Frontend dev server
cd app/frontend && npm run dev

# Full application start
cd app && ./start_app_v2.sh
```

---

## Test Output Locations

- Backend test reports: `app/backend/tests/coverage_html/`
- Frontend test reports: `app/frontend/playwright-report/`
- Screenshots on failure: `app/frontend/test-results/`

---

## Configuration Files

- Backend config: `app/backend/src/config.py`
- Frontend config: `app/frontend/vite.config.ts`
- Test config: `app/frontend/playwright.config.ts`
- Environment: `app/.env`

---

## Additional Notes

1. **Prerequisites**: Ensure all dependencies are installed before running tests
2. **Database**: Tests use a separate test database to avoid conflicts
3. **API Keys**: Configure required API keys in `.env` before testing
4. **Port Conflicts**: Ensure ports 5000 (backend) and 8080 (frontend) are available
5. **Browser**: For E2E tests, install browsers with `npx playwright install`