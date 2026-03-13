-- Run this in the Supabase SQL Editor to set up the newsletter table

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Row Level Security (RLS) setup (optional but recommended)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so people can subscribe from the website)
CREATE POLICY "Allow public insert to newsletter_subscribers" 
ON newsletter_subscribers 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Only allow service role (or authenticated admin) to select
CREATE POLICY "Allow admin to read newsletter_subscribers" 
ON newsletter_subscribers 
FOR SELECT 
USING (auth.role() = 'service_role');
