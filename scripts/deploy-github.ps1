# Execute após: gh auth login
# Cria o repositório fcamarahorashub e envia o código

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

gh auth status
git branch -M main

if (-not (git remote get-url origin 2>$null)) {
  gh repo create fcamarahorashub --public --source=. --remote=origin --description "Hub de Apontamentos FCamara"
} else {
  git push -u origin main
}

Write-Host "Repositório pronto. Conecte em https://vercel.com/new e importe fcamarahorashub."
