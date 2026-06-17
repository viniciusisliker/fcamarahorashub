# Sincroniza credenciais Supabase (fcamarahorashub) com a Vercel.
# Requer: supabase CLI logado + vercel CLI logado na conta Vinicius Isliker.
#
# Uso: .\scripts\sync-vercel-supabase-env.ps1

$ErrorActionPreference = "Stop"
$projectRef = "kjfwstmxldxbbuwmjtji"
$vercelProject = "fcamarahorashub"

$keysJson = npx supabase@2.106.0 projects api-keys --project-ref $projectRef -o json 2>$null
$keys = $keysJson | ConvertFrom-Json
$anon = ($keys | Where-Object { $_.id -eq "anon" } | Select-Object -First 1).api_key
$url = "https://$projectRef.supabase.co"

if (-not $anon) {
  Write-Error "Não foi possível obter a anon key do Supabase."
}

Write-Host "Configurando env vars em $vercelProject (Production)..."

function Set-VercelEnv($name, $value) {
  $value | npx vercel env add $name production --force --yes 2>&1 | Out-Null
  Write-Host "  $name"
}

Set-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" $url
Set-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" $anon
Set-VercelEnv "NEXT_PUBLIC_DATA_SOURCE" "supabase"
Set-VercelEnv "NEXT_PUBLIC_USE_MOCK_DATA" "false"
Set-VercelEnv "NEXT_PUBLIC_SITE_URL" "https://ftimesheethub.vercel.app"

Write-Host ""
Write-Host "Concluído. Rode um redeploy em https://ftimesheethub.vercel.app"
