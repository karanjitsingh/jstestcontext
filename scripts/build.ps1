param(
    [switch] $clean,
    [switch] $nolint,
    [ValidateSet("Debug", "Release")]
    [string] $configuration="Debug"
)

$base = "$([System.IO.Path]::GetDirectoryName($myInvocation.MyCommand.Definition))\base.ps1"

. $base

function CreateDirectory($dir)
{
    if (!(Test-Path $dir))
    {
        mkdir $dir > $null
    }
}

function Build-Clean {
    Write-Host "Cleaning folders.`n";
    
    Remove-Item (Join-Path $ProjectDir "artifacts\*") -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $ProjectDir "src\JSTest.Runner\bin\") -Recurse -Force -ErrorAction SilentlyContinue
}

function Restore-Package {
    Write-Host "`nRestoring npm packages.`n"
    npm install
}

function Publish-Package {
    
    Write-Host "`nPublishing to artifacts."

    $OutPath = [IO.Path]::Combine($Artifacts, $configuration, "out")
    $ConfigurationPath = Join-Path $Artifacts $configuration

    CreateDirectory($Artifacts)
    CreateDirectory($ConfigurationPath)
    CreateDirectory($OutPath)

    # Copy JSTestRunner
    Copy-Item -Path (Join-Path $BinDir "*") -Destination $OutPath -Force -Recurse

    # Copy Package.json & README.md
    Copy-Item -Path (Join-Path $ProjectDir "package.json") -Destination $OutPath -Force
    Copy-Item -Path (Join-Path $ProjectDir "README.md") -Destination $OutPath -Force

    Push-Location $ConfigurationPath
    npm pack $OutPath
    Pop-Location 
}

function Build-Solution {
    # Delete Unnecessary files produced in net451
    Write-Host "`nStarting typescript build."
    if(!$nolint) { npm run lint }
    npm run build:$configuration

    if($configuration -eq "Release") {
        Get-ChildItem -Path $BinDir -Recurse -Filter *.map | Remove-Item
    }
}

if($clean) { Build-Clean; }
Restore-Package
Build-Solution
Publish-Package