# HS_aeRender
  
After Effects backgrond rendering (aerender command) tool which allow artists to continue working on After Effects while any render is running on.

[NOTICE] I had uploaded "include" folder but that is not required no longer. If you already installed the 'include' folder, you can remove that from your disk.

## System Requirement
After Effects 14.0 or later but recommend 15.1 (or later) since Adobe's new support policy.  
  
  
## Install
Copy "HS_aerender.jsx" and "(include)" in After Effects Script Folder.
  
  
#### Mac
$HOME/Library/Preferences/Adobe/After Effects/<version>  
(Drag and drop the jsx file into After Effects project panel)  
  
  or  
/Applications/<Adobe After Effects CC 2019>/Scripts (with administrator privileges)  
  
#### Windows
$HOME¥AppData¥Roaming¥Adobe¥After Effects¥<version>  
(Drag and drop the jsx file into After Effects project panel)  
  
  or  
C:\Program Files\Adobe\Adobe After Effects CC 2019\Support Files\Scripts (with administrator privileges)  
  
  
## Usage
After Effects -> File -> Scripts -> HS_aerender.jsx

Render queue must be set in your project in advance because of this script will take over all render parameters from AEP's render queue.  

This script makes a folder which holds a pair of a dupicated AEP file and its render-command (.sh for macos or .bat file for Windows). The folder will be placed in the same directory as AEP file. Folder name is depends on your AEP file; 

For example, if AEP file name was "myproject.aep", the folder is named "myproject_aerender".  

Note that all files will remain in this folder which will not be removed automatically.  
  
  
## Licence
MIT License
