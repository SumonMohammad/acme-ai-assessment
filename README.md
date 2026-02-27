## This is an UI automation testing of search functionality

# Dependencies 
## Run backend and frontend using Docker


### To run this project first clone this repo then go to root directory 

## Install playwright 

## install dependencies 
```bash
run : npm install 

then run : npx playwright test
```

## To Run Load Test you need to install K6 first 

```bash
run : cd loadTest
then run : k6 run generate_api_load_test.js
```

## I have put postman collection for API test inside BackendAPI-Test directory

### To run the automation api test just import the collection into your postman then send request it will run all the cases one after one
