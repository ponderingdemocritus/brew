# Loafs Brew Journal

A beautiful coffee extraction journal app to track your coffee brewing experiments.

## Features

- Track coffee extractions with detailed parameters
- Record bean information, grind size, brew time, and more
- Rate your extractions
- Persistent storage with Supabase
- User authentication with email/password and GitHub

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- GitHub OAuth App (for GitHub authentication)

### Installation

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Supabase Setup

1. Create a new Supabase project
2. Set up the database schema by running the SQL script in `supabase/migrations/20240630_coffee_extractions.sql`
3. Enable Row Level Security (RLS) for the `coffee_extractions` table
4. Set up authentication:
   - Email/Password authentication is enabled by default
   - For GitHub authentication:
     - Create a GitHub OAuth App at https://github.com/settings/developers
     - Set the Authorization callback URL to: `https://your-supabase-project.supabase.co/auth/v1/callback`
     - In Supabase Dashboard, go to Authentication > Providers > GitHub
     - Enable GitHub Auth and enter your GitHub Client ID and Secret

### Running the App

```
npm run dev
```

or

```
yarn dev
```

## Database Schema

The app uses a `coffee_extractions` table with the following structure:

- `id`: UUID (Primary Key)
- `created_at`: Timestamp (Auto-generated)
- `user_id`: UUID (Foreign Key to auth.users)
- `date`: Timestamp
- `bean_name`: Text
- `bean_price`: Decimal
- `coffee_weight`: Decimal
- `water_weight`: Decimal
- `grind_size`: Text
- `brew_time`: Text
- `temperature`: Decimal
- `rating`: Integer
- `notes`: Text

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Supabase (Backend as a Service)
- Vite (Build tool)

## License

MIT
