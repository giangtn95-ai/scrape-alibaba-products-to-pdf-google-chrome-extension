<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Step 1: Download the Source Code
Navigate to the Releases section on the right side of this GitHub page and download the latest version.

Your computer will download a compressed file (ZIP).

Extract the file into a folder of your choice.

Step 2: Build the Application
Open your Terminal (Command Prompt or PowerShell) and navigate to the extracted folder. Run the following commands:

Install dependencies:

Bash
'npm install'
Compile the project:

Bash
'npm run build'
Note: This process bundles the code into a production-ready extension located in the /dist (or /build) folder.

Step 3: Install on Chrome / Edge
Open your browser and type chrome://extensions/ in the address bar.

In the top-right corner, toggle the "Developer mode" switch to ON.

Click the "Load unpacked" button that appears in the top-left.

Select the build folder (the one created in Step 2) to complete the installation.

A few small tips for your GitHub:
The folder name: In Step 3, make sure to specify if the folder is named dist or build (I used build folder as a placeholder).

Prerequisites: You might want to mention that the user needs Node.js installed on their machine to run the npm commands, as some beginners might not have it yet!
## Run Locally

