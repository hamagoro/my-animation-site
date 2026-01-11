@echo off
setlocal enabledelayedexpansion
set "base=vol"
set "last=00"
for /d %%i in (%base%*) do (
    set "name=%%i"
    set "num=!name:%base%=!"
    if 1!num! GTR 1!last! set "last=!num!"
)
set /a next=1!last! - 100 + 1
if %next% LSS 10 (set "next=0!next!")
mkdir %base%%next%