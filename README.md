**PRODUCT PREVIEW**
<img width="449" height="852" alt="Screenshot 2026-04-21 022327" src="https://github.com/user-attachments/assets/faee10b8-58e0-4391-98ce-8241329cbe10" />

**Step 1: **Download the Source Code
Navigate to the **Releases** section on the right side of this GitHub page and download the latest version.

Your computer will download a compressed file (ZIP).

Extract the file into a folder of your choice.

**Step 2: **Build the Application
Open your Terminal (Command Prompt or PowerShell) and navigate to the extracted folder, or open folder right click run Cmd or Powershell. Run the following commands:

Install dependencies:
```
<pre>

npm install

npm run build

</pre>
```
Note: This process bundles the code into a production-ready extension located in the /dist (or /build) folder.

**Step 3:** Install on **Chrome / Edge**
Open your browser and type **chrome://extensions/** in the address bar.

In the top-right corner, toggle the** "Developer mode"** switch to ON.

Click the **"Load unpacked"** button that appears in the top-left.

Select the build folder (the one created in Step 2 **"dist"** in the app folder) to complete the installation.

Done!
_If print PDF you need to do it manually by using this option _
<img width="442" height="117" alt="Screenshot 2026-04-21 024107" src="https://github.com/user-attachments/assets/91095f1c-e13a-45d8-ba9b-be8debc5d8bd" />
_then right click to print page._


Prerequisites: You might want to mention that the user needs Node.js installed on their machine to run the npm commands, as some beginners might not have it yet!
## Run Locally

