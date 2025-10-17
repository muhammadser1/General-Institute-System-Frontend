# Project Structure - Visual Guide

## 📂 Complete File Tree

```
General-Institute-System-Frontend/
│
├── public/                          # Static assets
│   ├── images/                     # Images (logo, icons, etc.)
│   │   └── .gitkeep
│   └── icons/                      # Icon files
│       └── .gitkeep
│
├── src/                            # Source code
│   │
│   ├── components/                 # Reusable components
│   │   ├── common/                 # Common UI components
│   │   │   ├── Alert.jsx          # Alert/notification component
│   │   │   ├── Alert.css
│   │   │   ├── Badge.jsx          # Status badge component
│   │   │   ├── Badge.css
│   │   │   ├── Button.jsx         # Button component
│   │   │   ├── Button.css
│   │   │   ├── Card.jsx           # Card container
│   │   │   ├── Card.css
│   │   │   ├── Input.jsx          # Input field
│   │   │   ├── Input.css
│   │   │   ├── Loading.jsx        # Loading spinner
│   │   │   ├── Loading.css
│   │   │   ├── Modal.jsx          # Modal dialog
│   │   │   ├── Modal.css
│   │   │   ├── Select.jsx         # Dropdown selector
│   │   │   ├── Select.css
│   │   │   ├── Table.jsx          # Data table
│   │   │   └── Table.css
│   │   │
│   │   └── layout/                 # Layout components
│   │       ├── Footer.jsx         # Page footer
│   │       ├── Footer.css
│   │       ├── Header.jsx         # Main header (wrapper)
│   │       ├── HeaderDesktop.jsx  # Desktop header
│   │       ├── HeaderMobile.jsx   # Mobile header
│   │       ├── Header.css
│   │       ├── Sidebar.jsx        # Side navigation
│   │       └── Sidebar.css
│   │
│   ├── contexts/                   # React Context providers
│   │   └── AuthContext.jsx        # Authentication context
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useMediaQuery.js       # Responsive hook
│   │
│   ├── layouts/                    # Page layouts
│   │   ├── AuthLayout.jsx         # Auth pages layout
│   │   ├── AuthLayout.css
│   │   ├── MainLayout.jsx         # Main app layout
│   │   └── MainLayout.css
│   │
│   ├── pages/                      # Page components
│   │   │
│   │   ├── admin/                  # Admin pages
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminDashboardPageDesktop.jsx
│   │   │   ├── AdminDashboardPageMobile.jsx
│   │   │   ├── UsersManagementPage.jsx
│   │   │   ├── UsersManagementPageDesktop.jsx
│   │   │   ├── UsersManagementPageMobile.jsx
│   │   │   ├── TeacherEarningsPage.jsx
│   │   │   ├── TeacherEarningsPageDesktop.jsx
│   │   │   ├── TeacherEarningsPageMobile.jsx
│   │   │   ├── PaymentsPage.jsx
│   │   │   ├── PaymentsPageDesktop.jsx
│   │   │   ├── PaymentsPageMobile.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── PricingPageDesktop.jsx
│   │   │   └── PricingPageMobile.jsx
│   │   │
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPageDesktop.jsx
│   │   │   ├── LoginPageMobile.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── SignupPageDesktop.jsx
│   │   │   └── SignupPageMobile.jsx
│   │   │
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DashboardPageDesktop.jsx
│   │   │   └── DashboardPageMobile.jsx
│   │   │
│   │   ├── lessons/                # Lesson pages
│   │   │   ├── CreateLessonPage.jsx
│   │   │   ├── CreateLessonPageDesktop.jsx
│   │   │   ├── CreateLessonPageMobile.jsx
│   │   │   ├── LessonDetailPage.jsx
│   │   │   ├── LessonDetailPageDesktop.jsx
│   │   │   ├── LessonDetailPageMobile.jsx
│   │   │   ├── LessonsPage.jsx
│   │   │   ├── LessonsPageDesktop.jsx
│   │   │   └── LessonsPageMobile.jsx
│   │   │
│   │   ├── profile/                # Profile pages
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ProfilePageDesktop.jsx
│   │   │   └── ProfilePageMobile.jsx
│   │   │
│   │   └── public/                 # Public pages
│   │       ├── HomePage.jsx
│   │       ├── HomePageDesktop.jsx
│   │       ├── HomePageMobile.jsx
│   │       ├── PricingPublicPage.jsx
│   │       ├── PricingPublicPageDesktop.jsx
│   │       └── PricingPublicPageMobile.jsx
│   │
│   ├── routes/                     # Route configuration
│   │   └── AppRoutes.jsx          # All routes with protection
│   │
│   ├── services/                   # API service layer
│   │   ├── api.js                 # Axios instance
│   │   ├── authService.js         # Authentication API
│   │   ├── lessonService.js       # Lessons API
│   │   ├── adminService.js        # Admin API
│   │   ├── paymentService.js      # Payments API
│   │   └── pricingService.js      # Pricing API
│   │
│   ├── styles/                     # CSS styles
│   │   ├── components/            # Component styles
│   │   │   ├── layout/
│   │   │   │   ├── Footer.css
│   │   │   │   ├── Header.css
│   │   │   │   └── Sidebar.css
│   │   │   └── common/            # Common component styles
│   │   │       ├── Alert.css
│   │   │       ├── Badge.css
│   │   │       ├── Button.css
│   │   │       ├── Card.css
│   │   │       ├── Input.css
│   │   │       ├── Loading.css
│   │   │       ├── Modal.css
│   │   │       ├── Select.css
│   │   │       └── Table.css
│   │   │
│   │   ├── layouts/               # Layout styles
│   │   │   ├── AuthLayout.css
│   │   │   └── MainLayout.css
│   │   │
│   │   ├── pages/                 # Page styles
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.css
│   │   │   │   ├── UsersManagementPage.css
│   │   │   │   ├── TeacherEarningsPage.css
│   │   │   │   ├── PaymentsPage.css
│   │   │   │   └── PricingPage.css
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.css
│   │   │   │   └── SignupPage.css
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.css
│   │   │   ├── lessons/
│   │   │   │   ├── CreateLessonPage.css
│   │   │   │   ├── LessonDetailPage.css
│   │   │   │   └── LessonsPage.css
│   │   │   ├── profile/
│   │   │   │   └── ProfilePage.css
│   │   │   └── public/
│   │   │       ├── HomePage.css
│   │   │       └── PricingPublicPage.css
│   │   │
│   │   ├── App.css                # App styles
│   │   └── index.css              # Global styles & CSS variables
│   │
│   ├── utils/                      # Utility functions
│   │   └── helpers.js             # Date, currency, validation helpers
│   │
│   ├── constants/                  # Constants & configuration
│   │   └── config.js              # App configuration
│   │
│   ├── App.jsx                     # Main App component
│   └── main.jsx                    # Application entry point
│
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite configuration
├── README.md                       # Project documentation
├── SETUP_GUIDE.md                  # Setup & implementation guide
└── PROJECT_STRUCTURE.md            # This file
```