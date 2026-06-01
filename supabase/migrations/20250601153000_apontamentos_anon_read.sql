-- Leitura via API (anon key) até Auth gestor/RH
create policy "apontamentos_select_anon"
  on public.apontamentos for select
  to anon
  using (true);
