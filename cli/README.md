# CLI

Contents:

- Command line interface (CLI) application as a client of the REST API to perform several administrative commands and for testing of the API's endpoints.

## How to run locally

- Navigate to this folder using "cd <path>/TL21-88/cli"
- Run "npm install" to install all dependencies
- Run using "node ." command and passing any parameters as defined per CLI specification (or run "node ." to see all available scopes)

## Steps for deploy

- Navigate to this folder using "cd <path>/TL21-88/cli"
- Install as system command by using "npm install -g" command inside this folder
- After installation, CLI app can now run by executing the command "se2188" and passing any parameters from command line
- In order to uninstall, run "npm uninstall -g cli"

### Example calls for each scope:

- se2188
- se2188 healthcheck
- se2188 passesperstation --station KO01 --datefrom 20200101 --dateto 20200201 --format json
- se2188 passesanalysis --op1 aodos --op2 kentriki_odos --datefrom 20200101 --dateto 20200301 --format json
- se2188 passescost --op1 aodos --op2 kentriki_odos --datefrom 20200101 --dateto 20200301 --format json
- se2188 chargesby --op1 aodos --datefrom 20200101 --dateto 20200301 --format json
- se2188 admin --passesupd --source "E:\Workspace.Projects\TL21-88\database\csv\passes.csv"
- se2188 resetpasses
- se2188 resetstations
- se2188 resetvehicles
- se2188 login --username admin --passw 123456
- se2188 logout

### Not Implemented (user modification and user details):

- admin --users [value]
- admin --usermod --username [value] --passw [value]

## Tools:

### Languages

- JavaScript

### Package manager

- npm v6.14.15
- node v14.18.0

### Node Modules

- yargs (for reading arguments from command line)
- axios (for making HTTP requests to API)
- fast-csv (for parsing CSV files)
- cli-progress (to show progress bar while uploading passes from csv file)
- jest (for unit tests)