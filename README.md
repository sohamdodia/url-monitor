# Setup

1. Clone this repo
2. Copy `.env.example` file into `.env` file and add credentials.
3. run `npm i`
4. run `sh start.sh` or `npm start`
5. Server is running at: [http://localhost:6005](http://localhost:6005)

# End Points

  * `/url`
      * `GET /`
          * Get all urls
          * **Requires**: No parameters
          * **Accepts**: No parameters
      * `GET /:id`
          * Get a single url
          * **Requires**: No parameters
          * **Accepts**: No parameters
      * `POST /`
          * Creates a new url to monitor
          * **Requires**: `url, method`
          * **Accepts**: `url, method, headers, data`
      * `PUT /:id`
          * Updates a url data
          * **Requires**: No parameters
          * **Accepts**: `url, method, headers, data`
      * `DELETE /:id/`
          * Deletes a url
          * **Requires**: No parameters
          * **Accepts**: No parameters
      * `GET /start-monitoring`
          * Start monitoring URLs
          * **Requires**: No parameters
          * **Accepts**: No parameters

### Useful Commands
1. `ps -ef | grep cron`
2. `pkill -f cron`