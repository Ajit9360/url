/*
  # Create QR codes table and setup RLS

  1. New Tables
    - `qr_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `value` (text)
      - `options` (jsonb)
      - `scan_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `qr_codes` table
    - Add policy for authenticated users to select, insert, update, and delete their own QR codes
*/

CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  value text NOT NULL,
  options jsonb NOT NULL,
  scan_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own QR codes
CREATE POLICY "Users can read their own QR codes"
ON qr_codes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to insert their own QR codes
CREATE POLICY "Users can insert their own QR codes"
ON qr_codes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own QR codes
CREATE POLICY "Users can update their own QR codes"
ON qr_codes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to delete their own QR codes
CREATE POLICY "Users can delete their own QR codes"
ON qr_codes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_qr_codes_updated_at
BEFORE UPDATE ON qr_codes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();