# test-cli

Περιεχόμενα:

- CLI unit & functional tests

## Unit Testing

Unit testing is done using jest library for Node.js .

### How to run locally

- Make sure CLI application is already installed
- Navigate to the CLI folder using "cd <path>/TL21-88/cli"
- Run using "npm run unit <unit-name>" command (example: npm run unit Scope)

### Available units for testing:

- Scope
- Healthcheck
- ChargesBy
- PassesAnalysis
- PassesCost
- PassesPerStation
- ResetPasses
- ResetStations
- ResetVehicles
- Login
- Logout
- Admin
- utils
- index

Test all units at once by calling:

- npm run unit

## Functional Testing

Functional testing is done using jest library for Node.js .

### How to run locally

- Make sure CLI application is already installed
- Navigate to the CLI folder using "cd <path>/TL21-88/cli"
- Run using "npm run functional <unit-name>" command (example: npm run functional Scope)

### Available units for testing:

- Healthcheck
- ChargesBy
- PassesAnalysis
- PassesCost
- PassesPerStation
- ResetPasses
- ResetStations
- ResetVehicles
- Login
- Logout
- Admin

## Tools:

### Languages

- JavaScript

### Package manager

- npm v6.14.15
- node v14.18.0

### Node Modules

- jest (for unit testing)
