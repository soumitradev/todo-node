title: Create and Update todos

---

**The only endpoint that handles Create and Update operations is:**

- ```
    /api/v1/todo/
  ```

  For POST and PUT requests (to Create and Update todos)

---

### POST

The only endpoint that accepts POST requests is the `/api/v1/todo/` endpoint. Making a POST request to this endpoint will create a new todo with the data provided.

- On successful creation, it returns the HTTP response code `201` along with the todo created in JSON format as the response body.
- If creation is not successful, it returns the HTTP response code `400` along with the Mongo error in JSON format as the response body.

<b>Example:</b>

<details>
  <summary><b>Creating a new todo:</b></summary>
The Request

```json
{
  "title": "ok",
  "private": false,
  "tasks": [
    {
      "body": "test",
      "done": false
    },
    {
      "done": false
    }
  ]
}
```

will return the following JSON as the response body with a status code of 201

```json
{
  "desc": "",
  "title": "ok",
  "tasks": [
    {
      "body": "test",
      "_id": "5f54903dc3bcbd243dd17fd7",
      "done": false
    },
    {
      "body": "",
      "_id": "5f54903dc3bcbd243dd17fd8",
      "done": false
    }
  ],
  "_id": "dJwFgdQaVg",
  "private": false,
  "__v": 0
}
```

> Note how the ID is auto generated, and not returned as `id` but `_id`, and that the description and body default to empty strings.

> You might notice that each task also has its own id. This id is provided by MongoDB, and doesnt have any significance in the scope of this API.

</details>

<b>Errors:</b>

<details>
  <summary><b>If custom id is already taken:</b></summary>

Request:

```json
{
  "title": "ok",
  "id": "ok",
  "private": false,
  "tasks": [
    {
      "body": "test",
      "done": false
    },
    {
      "done": false
    }
  ]
}
```

Response (HTTP Status code 400):

```json
{
  "driver": true,
  "name": "MongoError",
  "index": 0,
  "code": 11000,
  "keyPattern": {
    "_id": 1
  },
  "keyValue": {
    "_id": "ok"
  }
}
```

</details>

<details>
  <summary><b>If the Schema Validation fails:</b></summary>

Request:

```json
{
  "title": "",
  "private": false,
  "tasks": [
    {
      "body": "test",
      "done": false
    },
    {
      "done": false
    }
  ]
}
```

Response (HTTP Status Code: 400):

```json
{
  "errors": {
    "title": {
      "name": "ValidatorError",
      "message": "Path `title` is required.",
      "properties": {
        "message": "Path `title` is required.",
        "type": "required",
        "path": "title",
        "value": ""
      },
      "kind": "required",
      "path": "title",
      "value": ""
    }
  },
  "_message": "todoList validation failed",
  "message": "todoList validation failed: title: Path `title` is required."
}
```

</details>

<details>
  <summary><b>If a required parameter is not provided:</b></summary>

Request:

```json
{
  "private": false,
  "tasks": [
    {
      "body": "test",
      "done": false
    },
    {
      "done": false
    }
  ]
}
```

Response (HTTP Status Code 400):

```json
{
  "errors": {
    "title": {
      "name": "ValidatorError",
      "message": "Path `title` is required.",
      "properties": {
        "message": "Path `title` is required.",
        "type": "required",
        "path": "title"
      },
      "kind": "required",
      "path": "title"
    }
  },
  "_message": "todoList validation failed",
  "message": "todoList validation failed: title: Path `title` is required."
}
```

</details>

---

### PUT

The only endpoint that accepts PUT requests is the `/api/v1/todo/` endpoint. Making a PUT request to this endpoint will either Create a new todo with the information given, or update an existing todo.

If an existing todo has the id given, it will update that todo. Else, if no such todo is found, it will create a new todo with the information given.

If the id field itself is omitted, it will create a new todo with the information given with an automatically assigned id.

While updating an existing todo, fields not being updated can be omitted. The API will only update the fields that are given. If a field is omitted, the todo will keep its existing value for that field.

Todos can also be moved from one id to another using the `nid` field that gives the new `id` for the todo.

**Note:** If both an nid, and an id are provided, and no existing todo exists with the given id, the new todo will be assigned the `id`, not the `nid`.

**Note:** The PUT request is idempotent. i.e. Performing multiple PUT requests will result in the same result as performing one PUT request with the same data. The response is different when making more than one PUT request when moving a todo to a new id, but the state of the todo stays the same regardless, so this request is entirely idempotent.

- On successful creation, it returns the HTTP response code `201` along with the todo created in JSON format as the response body.
- On successful updating, it returns the HTTP response code `200` along with the updated todo in JSON format as the response body
- If creation or updating is not successful due to either incomplete information or an internal error, it returns the HTTP response code `400` along with the error in JSON format as the response body.

#### Examples:

<details>
  <summary><b>Creating a new todo:</b></summary>

In this example, we assume that no such todo exists with id `update`

Request:

```json
{
  "title": "old title",
  "id": "update",
  "private": true,
  "tasks": [
    {
      "done": true,
      "body": "task 1"
    },
    {
      "done": false,
      "body": "task 2"
    }
  ]
}
```

Response (HTTP Status Code 201):

```json
{
  "desc": "",
  "title": "old title",
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
  "_id": "update",
  "private": true,
  "__v": 0
}
```

> Note that if no id was provided in the request, the API would have assigned it an autogenerated id and saved it.

</details>

<details>
  <summary><b>Updating an existing todo:</b></summary>

We will update the todo we created in the above example

Request:

```json
{
  "title": "new title",
  "id": "update"
}
```

Response (HTTP Status Code 200):

```json
{
  "desc": "",
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
  "_id": "update",
  "private": true,
  "__v": 0
}
```

> Note how we didn't need to provide the rest of the fields that didn't need to be updated.

</details>

<details>
  <summary><b>Moving an existing todo to a new id:</b></summary>

Request:

```json
{
  "id": "update",
  "nid": "update-example"
}
```

Response (HTTP Status Code 200):

```json
{
  "desc": "",
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
  "_id": "update-example",
  "private": true,
  "__v": 0
}
```

> Note again how we didn't need to provide the rest of the fields that didn't need to be updated.

</details>

#### Errors:

**Note:** For Schema validation errors when updating or creating a new todo, the errors are same as the Errors documented in the POST request.

<details>
  <summary><b>Moving an existing todo to a new id, if another todo already exists at that new id:</b></summary>

Request:

```json
{
  "id": "update-example",
  "nid": "existing-id"
}
```

Response (HTTP Status Code 400):

```json
{
  "driver": true,
  "name": "MongoError",
  "index": 0,
  "code": 11000,
  "keyPattern": {
    "_id": 1
  },
  "keyValue": {
    "_id": "existing-id"
  }
}
```

</details>
