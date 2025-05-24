/*
  # Create function to increment scan count

  1. New Functions
    - `increment_scan_count`: A stored procedure to safely increment the scan count for a QR code
  
  2. Usage
    - Called from edge function to track QR code scans
*/

CREATE OR REPLACE FUNCTION increment_scan_count(qr_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE qr_codes
  SET scan_count = scan_count + 1,
      updated_at = now()
  WHERE id = qr_id
  RETURNING scan_count INTO new_count;
  
  RETURN new_count;
END;
$$;