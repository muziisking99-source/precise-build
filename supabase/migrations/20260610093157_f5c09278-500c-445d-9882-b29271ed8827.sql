
CREATE POLICY "Public read content images" ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images','character-images','hero-images'));

CREATE POLICY "Admins upload content images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images','character-images','hero-images')
    AND public.has_admin_access(auth.uid()));

CREATE POLICY "Admins update content images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images','character-images','hero-images')
    AND public.has_admin_access(auth.uid()));

CREATE POLICY "Admins delete content images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images','character-images','hero-images')
    AND public.has_admin_access(auth.uid()));
