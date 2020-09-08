title: Read and Delete todos

---

**The only endpoint that handles Read and Delete operations is:**

- ```
    /api/v1/todo/{id}/
  ```

  For GET and DELETE requests (to Read and Delete todos)

---

### GET

The only endpoints that accepts GET requests are the `/api/v1/todo/{id}/` and `/api/v1/todos/`. Making a GET request to these endpoints will read the todos.

The `/api/v1/todo/{id}/` endpoint returns the todo with id `id`, and the `/api/v1/todos/` returns with a list of all public todos.

- On successful reading, it returns the HTTP response code `200` along with the todo in JSON format as the response body.
- If reading is not successful due to some internal error, it returns the HTTP response code `500` along with the Mongo error in JSON format as the response body.
- If the todo is not found, it returns the HTTP response code `404` along with the following JSON error message:

```json
{
  "message": "Todo list not found"
}
```

**Note:** This request is idempotent since making many requests will not result in any different state than making one request. The state of the todo will stay the same.


<b>Example:</b>
  
<details>
  <summary><b>Reading a todo:</b></summary>

The Request is made to `/api/v1/todo/joe`, and it is assumed that this todo exists.

Response (HTTP Status Code 200):

```json
{
  "desc": "LETS GOOOO",
  "_id": "joe",
  "title": "IT WORKED",
  "tasks": [
    {
      "body": "oje",
      "_id": "5f53576fa8d141c05da694c3",
      "done": true
    },
    {n
      "body": "joe",
      "_id": "5f53576fa8d141c05da694c4",
      "done": true
    }
  ],
  "private": false,
  "__v": 0
}
```

</details>

<details>
  <summary><b>Reading all public todos:</b></summary>

The Request is made to `/api/v1/todos/`.

Response (HTTP Status Code 200):


```json
[
  {
    "desc": "",
    "_id": "custom_id",
    "title": "test-1",
    "tasks": [
      {
        "body": "test",
        "_id": "5f55e057fca87336a40e51e1",
        "done": false
      },
      {
        "body": "",
        "_id": "5f55e057fca87336a40e51e2",
        "done": false
      }
    ],
    "private": false,
    "__v": 0
  },
  {
    "desc": "",
    "_id": "hNiZ70wwFH",
    "title": "test-2",
    "tasks": [
      {
        "body": "test",
        "_id": "5f55e076fca87336a40e51e3",
        "done": false
      },
      {
        "body": "",
        "_id": "5f55e076fca87336a40e51e4",
        "done": false
      }
    ],
    "private": false,
    "__v": 0
  },
  {
    "desc": "",
    "_id": "3UEq-e0Uql",
    "title": "test-3",
    "tasks": [
      {
        "body": "test",
        "_id": "5f55e07dfca87336a40e51e5",
        "done": false
      },
      {
        "body": "",
        "_id": "5f55e07dfca87336a40e51e6",
        "done": false
      }
    ],
    "private": false,
    "__v": 0
  }
]
```


**Note:** If no todos are public at the moment, the response is an empty JSON list as shown below.

```json
[]
```

</details>

<details>
  <summary><b>Reading the last `limit` public todos:</b></summary>

The Request is made to `/api/v1/todos/{limit}`.

Here, the limit is set to 2. So, we make a GET request to:

`/api/v1/todos/2`

Response (HTTP Status Code 200):


```json
[
  {
    "desc": "",
    "_id": "custom_id",
    "title": "test-1",
    "tasks": [
      {
        "body": "test",
        "_id": "5f55e057fca87336a40e51e1",
        "done": false
      },
      {
        "body": "",
        "_id": "5f55e057fca87336a40e51e2",
        "done": false
      }
    ],
    "private": false,
    "__v": 0
  },
  {
    "desc": "",
    "_id": "hNiZ70wwFH",
    "title": "test-2",
    "tasks": [
      {
        "body": "test",
        "_id": "5f55e076fca87336a40e51e3",
        "done": false
      },
      {
        "body": "",
        "_id": "5f55e076fca87336a40e51e4",
        "done": false
      }
    ],
    "private": false,
    "__v": 0
  }
]
```


**Note:** If no todos are public at the moment, the response is an empty JSON list as shown below.

```json
[]
```

</details>

<b>Errors:</b>

<details>
  <summary><b>If no such todo exists</b></summary>

Response (HTTP Status Code 404):

```json
{
  "message": "Todo list not found"
}
```

</details>

---


### DELETE

The only endpoint that accepts DELETE requests is the `/api/v1/todo/{id}/` endpoint. Making a DELETE request to this endpoints will delete the todo with the given id.

- On successful deletion, it returns the HTTP response code `200` along with the todo it just deleted in JSON format as the response body.
- If reading is not successful due to some internal error, it returns the HTTP response code `500` along with the Mongo error in JSON format as the response body.
- If the todo is not found, it returns the HTTP response code `404` along with the following JSON error message:

```json
{
  "message": "Todo list not found"
}
```

**Note:** This request is also idempotent since making many requests will not result in any different state than making one request. The response will be different, but the state of the todo will stay the same.


<b>Examples:</b>

<details>
  <summary><b>Deleting a todo:</b></summary>

In this example, we assume that a todo exists with id `update-example`

Making a DELETE request to the following endpoint, we get the todo that used to exist at that id in JSON format as the response body.

Request:

DELETE request to `/api/v1/todo/update-example`

Response (HTTP Status Code 200):
```json
{
  "desc": "",
  "_id": "update-example",
  "title": "new title",
  "tasks": [
    {
      "body": "task 1",
      "_id": "5f54a7ef9b677f44d05a4212",
      "done": true
    },
    {
      "body": "task 2",
      "_id": "5f54a7ef9b677f44d05a4213",
      "done": false
    }
  ],
  "private": true,
  "__v": 0
}
```
</details>

<b>Errors:</b>


<details>
  <summary><b>Attempting to delete a non existing todo:</b></summary>

In the above example, we deleted the todo at id `update-example`. Making a DELETE request to the same path now will result in an error.

Request:

DELETE request to `/api/v1/todo/update-example`


Response (HTTP Status Code 404):

```json
{
  "message": "Todo list not found"
}
```

</details>
