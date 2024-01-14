
### When the server return with allowed origins * and credentials is include

```
Access to fetch at 'http://localhost:8080/login' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
```

### When the server return with allowed origins * and credentials is "same-origin"

```
Access to fetch at 'http://localhost:8080/travels' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

this is with crednetials = 'omit'

```
Access to fetch at 'http://localhost:8080/travels' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

### Server has allowed origins * and we don't pass authz header

Request goes through and backend will respond with Authz header not present.


let's pass token throuhg query param for now. We will fix cors later.


