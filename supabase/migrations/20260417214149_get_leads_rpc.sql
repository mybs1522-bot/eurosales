CREATE OR REPLACE FUNCTION get_leads_secure(auth_pass text)
RETURNS SETOF leads
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth_pass = 'Robbin#15' THEN
    RETURN QUERY SELECT * FROM leads ORDER BY created_at DESC;
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
END;
$$;
