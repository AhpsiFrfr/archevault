@echo off
echo Running SQL migrations...

echo Running create_profiles.sql migration...
npx supabase db push migrations/create_profiles.sql

echo Running add_solana_domain.sql migration...
npx supabase db push migrations/add_solana_domain.sql

echo Migrations completed! 