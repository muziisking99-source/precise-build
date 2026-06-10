
REVOKE ALL ON FUNCTION public.has_admin_access(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_access(uuid) TO authenticated;
