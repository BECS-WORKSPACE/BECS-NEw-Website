# Banerjee Electronics Consultancy Services (BECS) - Monorepo

Welcome to the BECS codebase repository. The project has been restructured into a clean, modern monorepo structure separating **client-side** sub-applications and the **backend API server**.

## Repository Structure

```
d:/BECS/
├── client/                     # Frontend Applications
│   ├── main-website/           # Main landing page & info hub (Port 5173, root /)
│   ├── becs-store/             # E-Commerce electronics store (Port 5174, base /store/)
│   ├── admin/                  # Admin control panel & telemetry (Port 5175, base /admin/)
│   ├── training-institute/     # Training & Certification app (Port 5176, base /training/)
│   └── shared/                 # Shared resources and assets
├── server/                     # Backend API & Database (Port 5000)
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express API route handlers
│   ├── middleware/             # Auth and role validators
│   ├── seed.js                 # Database seed script
│   └── index.js                # Server entry point
├── start-all.bat               # Windows batch launcher script
├── start-all.ps1               # PowerShell launcher script
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally on default port `27017`)

### Installation & Launching

You can start all BECS services (backend server and all 4 frontend applications) simultaneously using the provided launcher scripts.

#### Option A: PowerShell Launcher (Recommended)
Right-click [start-all.ps1](file:///d:/BECS/start-all.ps1) and choose **Run with PowerShell**, or execute the following in a PowerShell terminal:
```powershell
./start-all.ps1
```

#### Option B: Windows Batch Launcher
Double-click [start-all.bat](file:///d:/BECS/start-all.bat), or run the following in Command Prompt:
```cmd
start-all.bat
```

> [!NOTE]
> On the first launch, the script will ask if you want to seed the database. Choosing **y** will clear and pre-populate your MongoDB database with default electronics products and a default administrator user (`admin@becs.com` / `admin123`).

---

## Single-Domain / Path-Based Routing Configuration

This codebase is configured to support **single-domain path-based routing** in production (where all sub-applications are served from a single host like `https://becs.com` under paths `/store/`, `/admin/`, and `/training/`), while supporting independent ports during local development.

### Application Routing Map

| Application | Dev URL (Vite Dev Server) | Prod Path (Single Domain) | Routing Base Path |
| :--- | :--- | :--- | :--- |
| **Main Website** | `http://localhost:5173` | `/` (Root) | `/` (Root) |
| **E-Commerce Store** | `http://localhost:5174/store/` | `/store/` | `/store/` |
| **Admin Panel** | `http://localhost:5175/admin/` | `/admin/` | `/admin/` |
| **Training Institute** | `http://localhost:5176/training/` | `/training/` | `/training/` |
| **Backend API** | `http://localhost:5000/api` | `/api` | `/api` |

### Key Files & Configurations

1. **Vite Base Configuration**:
   - E-commerce Store: `/store/` base configured in [client/becs-store/vite.config.js](file:///d:/BECS/client/becs-store/vite.config.js)
   - Admin Panel: `/admin/` base configured in [client/admin/vite.config.js](file:///d:/BECS/client/admin/vite.config.js)
   - Training Institute: `/training/` base configured in [client/training-institute/vite.config.js](file:///d:/BECS/client/training-institute/vite.config.js)

2. **React Router Basename**:
   - React Router is configured with a matching `<Router basename="/store">` in [client/becs-store/src/App.jsx](file:///d:/BECS/client/becs-store/src/App.jsx#L716).

3. **Environment Configurations**:
   - Development environment variables in `.env` map applications to their respective ports.
   - Production environment variables in `.env.production` utilize relative routing (`/store/`, `/admin/`, `/training/`, `/api`) allowing seamless single-domain reverse proxy routing without hardcoded hosts.
