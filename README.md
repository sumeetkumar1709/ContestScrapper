# Coding Contest Scraper API

This project is an API that scrapes data from different coding contests and provides information about upcoming contests. It allows developers to retrieve details such as contest names, start dates, end dates, and contest URLs.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Response Format](#response-format)


## Installation

To use this API, follow these steps:

1. Clone the repository:
```
git clone https://github.com/sumeetkumar1709/ContestScrapper
```


2. Install the required dependencies:
```
npm i
```

3. Start the API server:
```
npm run start

```

The API server will start running on `http://localhost:8000`.

## Usage

Once the API server is running, you can send HTTP requests to the available endpoints to retrieve upcoming coding contest information.

It is recommended to use an API testing tool such as [Postman](https://www.postman.com/) or [cURL](https://curl.se/) for sending requests.


## Endpoints

The API provides the following endpoints:

- `GET /codechef`: Retrieves a list of upcoming coding contests from codechef.
- `GET /codeforces`: Retrieves a list of upcoming coding contests from codeforces.
- `GET /atcoder`: Retrieves a list of upcoming coding contests from codeforces.

## Response Format

1. `/codechef`

```json
{
    "0": {
        "contestcode": "START89",
        "contestname": "Starters 89",
        "date": "10 May 2023",
        "time": "Wed 14:30",
        "duration": "2 Hrs"
    },
    "1": {
        "contestcode": "START90",
        "contestname": "Starters 90",
        "date": "17 May 2023",
        "time": "Wed 14:30",
        "duration": "2 Hrs"
    },
    "2": {
        "contestcode": "START91",
        "contestname": "Starters 91",
        "date": "24 May 2023",
        "time": "Wed 14:30",
        "duration": "2 Hrs"
    },
    "3": {
        "contestcode": "START92",
        "contestname": "Starters 92",
        "date": "31 May 2023",
        "time": "Wed 14:30",
        "duration": "2 Hrs"
    }
}
```
2. `/codeforces`

```json
{
    "0": {
        "id": 1827,
        "name": "Codeforces Round (Div. 1)",
        "type": "CF",
        "phase": "BEFORE",
        "frozen": false,
        "durationSeconds": 7200,
        "startTimeSeconds": 1684074900,
        "relativeTimeSeconds": -701452
    },
    "1": {
        "id": 1828,
        "name": "Codeforces Round (Div. 2)",
        "type": "CF",
        "phase": "BEFORE",
        "frozen": false,
        "durationSeconds": 7200,
        "startTimeSeconds": 1684074900,
        "relativeTimeSeconds": -701452
    },
    "2": {
        "id": 1832,
        "name": "Educational Codeforces Round 148 (Rated for Div. 2)",
        "type": "ICPC",
        "phase": "BEFORE",
        "frozen": false,
        "durationSeconds": 7200,
        "startTimeSeconds": 1683902100,
        "relativeTimeSeconds": -528652
    },
    "3": {
        "id": 1824,
        "name": "Codeforces Round 872 (Div. 1)",
        "type": "CF",
        "phase": "BEFORE",
        "frozen": false,
        "durationSeconds": 7200,
        "startTimeSeconds": 1683547500,
        "relativeTimeSeconds": -174052
    },
    "4": {
        "id": 1825,
        "name": "Codeforces Round 872 (Div. 2)",
        "type": "CF",
        "phase": "BEFORE",
        "frozen": false,
        "durationSeconds": 7200,
        "startTimeSeconds": 1683547500,
        "relativeTimeSeconds": -174052
    },
    "5": {
        "id": 1829,
        "name": "Codeforces Round 871 (Div. 4)",
        "type": "ICPC",
        "phase": "BEFORE",
        "frozen": false,
        "durationSeconds": 8100,
        "startTimeSeconds": 1683383700,
        "relativeTimeSeconds": -10254
    }
}
```
3. `/atcoder`

```json
{
    "0": {
        "contestname": "パナソニックグループプログラミングコンテスト2023（AtCoder Beginner Contest 301）",
        "starttime": "2023-05-13(Sat) 12:00",
        "duration": "01:40",
        "ratedfor": " - 1999"
    },
    "1": {
        "contestname": "AtCoder Regular Contest 160",
        "starttime": "2023-05-14(Sun) 12:00",
        "duration": "02:00",
        "ratedfor": " - 2799"
    },
    "2": {
        "contestname": "AtCoder Grand Contest 062",
        "starttime": "2023-05-21(Sun) 12:00",
        "duration": "03:00",
        "ratedfor": "1200 - "
    },
    "3": {
        "contestname": "日鉄ソリューションズプログラミングコンテスト2023（AtCoder Beginner Contest 303）",
        "starttime": "2023-05-27(Sat) 12:00",
        "duration": "01:40",
        "ratedfor": " - 1999"
    },
    "4": {
        "contestname": "AtCoder Regular Contest 161",
        "starttime": "2023-05-28(Sun) 12:00",
        "duration": "02:00",
        "ratedfor": " - 2799"
    },
    "5": {
        "contestname": "ALGO ARTIS Programming Contest 2023（AtCoder Heuristic Contest 020）",
        "starttime": "2024-04-23(Tue) 06:00",
        "duration": "04:00",
        "ratedfor": "All"
    }
} 
```

4. `/leetcode`

```json
    {
        "0":
            {   
                "contestname":"Weekly Contest 345",
                "time":"Sunday 2:30 AM UTC"
            },
        "1":
            {   
                "contestname":"Biweekly Contest 104",
                "time":"Saturday 2:30 PM UTC"
            }
    }
```