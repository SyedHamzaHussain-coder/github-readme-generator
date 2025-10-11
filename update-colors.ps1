# Color Theme Replacement Script
# Old colors: Blue (#0000FF family), Purple (#800080 family)
# New colors: Primary (#556B2F), Secondary (#8FA31E), Accent (#C6D870)

$files = @(
    "src\components\ConnectStep.tsx",
    "src\components\TemplateStep.tsx",
    "src\components\PreviewStep.tsx",
    "src\components\GitHubProfile.tsx",
    "src\pages\Landing.tsx",
    "src\pages\Examples.tsx"
)

$replacements = @{
    # Blue replacements -> Secondary (Lime Green #8FA31E)
    'bg-blue-600' = 'bg-secondary'
    'bg-blue-500' = 'bg-secondary'
    'hover:bg-blue-700' = 'hover:bg-secondary-dark'
    'hover:bg-blue-600' = 'hover:bg-secondary-dark'
    'text-blue-600' = 'text-secondary'
    'text-blue-500' = 'text-secondary'
    'text-blue-700' = 'text-secondary-dark'
    'border-blue-500' = 'border-secondary'
    'border-blue-600' = 'border-secondary'
    'border-blue-400' = 'border-secondary'
    'bg-blue-50' = 'bg-accent-light'
    'border-blue-200' = 'border-accent'
    'from-blue-500' = 'from-secondary'
    'to-blue-600' = 'to-secondary'
    
    # Purple replacements -> Primary (Dark Olive #556B2F)
    'bg-purple-600' = 'bg-primary'
    'bg-purple-500' = 'bg-primary'
    'hover:bg-purple-700' = 'hover:bg-primary-dark'
    'hover:bg-purple-600' = 'hover:bg-primary-dark'
    'text-purple-600' = 'text-primary'
    'text-purple-500' = 'text-primary'
    'text-purple-700' = 'text-primary-dark'
    'border-purple-500' = 'border-primary'
    'border-purple-600' = 'border-primary'
    'bg-purple-50' = 'bg-primary/10'
    'from-purple-500' = 'from-primary'
    'from-purple-600' = 'from-primary'
    
    # Green replacements -> Accent (Light Lime #C6D870)
    'bg-green-600' = 'bg-accent'
    'bg-green-500' = 'bg-accent'
    'hover:bg-green-700' = 'hover:bg-accent-dark'
    'hover:bg-green-600' = 'hover:bg-accent-dark'
    'text-green-600' = 'text-accent-dark'
    'text-green-500' = 'text-accent-dark'
    'border-green-500' = 'border-accent'
    'bg-green-50' = 'bg-accent-light'
    
    # Indigo replacements -> Primary variant
    'bg-indigo-600' = 'bg-primary'
    'hover:bg-indigo-700' = 'hover:bg-primary-dark'
    'text-indigo-600' = 'text-primary'
}

foreach ($file in $files) {
    $filePath = Join-Path (Get-Location) $file
    if (Test-Path $filePath) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        $content = Get-Content $filePath -Raw
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            if ($content -match [regex]::Escape($old)) {
                $content = $content -replace [regex]::Escape($old), $new
                Write-Host "  Replaced: $old -> $new" -ForegroundColor Green
            }
        }
        
        Set-Content $filePath -Value $content -NoNewline
        Write-Host "  Completed: $file" -ForegroundColor Green
    } else {
        Write-Host "  Skipped (not found): $file" -ForegroundColor Yellow
    }
}

Write-Host "`nColor theme update completed!" -ForegroundColor Cyan
