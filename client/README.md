# THE SUITS
### Instant Synchronous Writing. No Friction.

The Suits is a high-end editorial environment for real-time collaboration. By removing authentication walls, profile setups, and notification settings, it provides a "Zero-Barrier Protocol" for teams who value the integrity of the written word.

---

## 🛠 Tech Stack
- **Frontend:** React.js (Vite)
- **Backend/Real-time:** Supabase (Database, Real-time engine, and Storage)
- **Routing:** React Router v6

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/swayam9705/The-Suits.git
cd editorial-monolith
```

### 2. Install Dependencies
```bash
cd client
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Project
```bash
npm run dev
```

### Features
* No Registration: Start a session and invite collaborators instantly via a Conference ID.

* Ephemeral Storage: Files are mapped to the session, not a user profile.

* Brutalist Interface: A white-walled gallery design focused entirely on typography.

* Auto-Purge Logic: (Optional) Configure Supabase pg_cron to wipe session data after 48 hours of inactivity.