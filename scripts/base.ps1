$ProjectDir = (Get-Item ([System.IO.Path]::GetDirectoryName($myInvocation.MyCommand.Definition))).Parent.FullName
$PackageJSON = Join-Path $ProjectDir "package.json"
$BinDir = Join-Path $ProjectDir "src\bin\$configuration\"
$Artifacts = Join-Path $ProjectDir "artifacts"
$TestFolder = Join-Path $ProjectDir "test"