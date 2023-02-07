# Practice-Express-Bcrypt

- Bcrypt를 이용한 암호화

## Bcrypt Install

```bash
> npm i bcrypt
```

## Usage

- bcrypt 모듈 설치 : npm install bcrypt 명령어를 사용하여 bcrypt 모듈을 설치합니다.
- 모듈 가져오기 : 개발 파일에서 var bcrypt = require("bcrypt") 명령어를 사용하여 bcrypt 모듈을 가져옵니다.
- 비밀번호 해시 생성 : `bcrypt.hash(password, saltRounds, callback)` 함수를 사용하여 비밀번호 해시를 생성합니다.
  - password: 해시할 비밀번호
  - saltRounds: salt 값으로 사용할 랜덤 값의 바이트 길이(해시의 난이도) // 12정도가 추천됨.
  - callback: 해시 생성이 완료되면 실행될 함수
- 비밀번호 비교 : `bcrypt.compare(password, hash, callback)` 함수를 사용하여 입력한 비밀번호와 저장된 해시 값을 비교합니다.
  - password: 비교할 비밀번호
  - hash: 저장된 해시 값
  - callback: 비교 작업이 완료되면 실행될 함수

```javascript
var bcrypt = require("bcrypt");
var password = "password123";

// bcrypt.hash 함수는 암호화된 비밀번호 해시 값을 생성하는데 사용
// password: 암호화할 비밀번호
// saltRounds: salt 값으로 사용될 랜덤 문자열의 길이. 길이가 길수록 공격자가 해시 값을 복원하는 것이 어렵다.
// callback: 해시 생성이 완료되면 실행될 콜백 함수. 첫 번째 매개변수로 오류 객체, 두 번째 매개변수로 암호화된 해시 값이 전달된다.
bcrypt.hash(password, 10, function (err, hash) {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Password hash:", hash);

  // bcrypt.compare 함수는 입력된 비밀번호와 암호화된 해시 값이 일치하는지 확인하는데 사용
  // password: 비교할 비밀번호
  // hash: 암호화된 해시 값
  // callback: 함수에서는 비교 결과를 받아와 처리할 수 있다. 비교 결과가 true이면 "password"와 "hash"가 일치한 것으로 판단되며, false이면 일치하지 않음을 의미.
  bcrypt.compare(password, hash, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Password match:", result);
  });
});
```

### 예시

```javascript
var bcrypt = require("bcrypt");
var express = require("express");
var app = express();

app.post("/signup", function(req, res) {
  var password = req.body.password;

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      console.error(err);
      res.status(500).send("Error while hashing the password");
      return;
    }
    // Store the hash in the database
  });
});

app.post("/login", function(req, res) {
  var password = req.body.password;
  var hashFromDb = ... // Retrieve the hash from the database

  bcrypt.compare(password, hashFromDb, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send("Error while comparing the password");
      return;
    }
    if (result) {
      // The password is correct, grant access
    } else {
      // The password is incorrect, deny access
    }
  });
});
```

- `/signup`

  - 이 엔드포인트는 POST 요청을 대기하고, req.body.password 필드에서 수신한 비밀번호를 bcrypt.hash 함수를 사용하여 해시한다.
  - 비밀번호 해싱 과정에서 오류가 발생하면 오류를 로그에 기록하고, 비밀번호 해싱중 오류가 발생했다는 메시지와 함께 500 Internal Server Error 응답을 보낸다.
  - 그렇지 않으면, 비밀번호 해시를 데이터베이스 (코드에 보이지 않음)에 저장한다.

- `/login `
  - 엔드포인트는 POST 요청을 기다리고 있으며, 데이터베이스에서 비밀번호 해시를 가져온다 (코드에 나타나지 않음).
  - 그런 다음 bcrypt.compare 함수를 사용하여 수신된 비밀번호 (req.body.password)와 데이터베이스에서의 비밀번호 해시를 비교한다.
  - 비교 과정에서 오류가 발생하면 오류를 기록하고 비밀번호 비교 중 오류가 발생했다는 메시지가 포함된 500 Internal Server Error 응답을 반환한다.
  - 비교가 성공하면 (즉, 비밀번호가 일치하면) 액세스를 허용한다. 비교가 실패하면 (즉, 비밀번호가 일치하지 않으면) 액세스를 거부한다.

> `엔드포인트(Endpoint)`는 클라이언트가 서버에 요청을 할 수 있는 주소(URL)을 말한다. <br>
> 서버에서는 각각의 엔드포인트에 대해 미리 정의한 로직에 따라 요청을 처리한다. <br>
> 예를 들어, 웹 어플리케이션에서는 /login과 같은 엔드포인트를 통해 로그인 기능을 제공할 수 있다.

#### Method

- `bcrypt.hash(plainTextPassword, saltRounds, callback)` : 이 메서드는 주어진 plainTextPassword를 saltRounds 만큼 salt 값을 추가하여 해시값으로 변환합니다. 이 과정이 완료되면 callback 함수가 호출되며, 첫 번째 인수로 오류(err) 또는 두 번째 인수로 해시된 패스워드가 전달됩니다.

- `bcrypt.compare(plainTextPassword, hashedPassword, callback)` : 이 메서드는 주어진 plainTextPassword와 hashedPassword 값을 비교하여 같은 경우 true, 다른 경우 false를 반환합니다. callback 함수는 첫 번째 인수로 오류(err), 두 번째 인수로 결과 값(result)이 전달됩니다.

- `bcrypt.genSalt(saltRounds, callback)` : 이 메서드는 saltRounds 만큼 salt 값을 생성합니다. 생성된 salt 값은 callback 함수에서 첫 번째 인수로 전달됩니다.
- ```javascript
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.error(err);
      return;
    }
    bcrypt.hash("password", salt, function (err, hash) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(hash);
    });
  });
  ```
  - `bcrypt.genSalt(10, callback)`을 호출하여 saltRounds에 10을, callback 함수를 전달한다.
  - `bcrypt.genSalt()` 메서드는 saltRounds의 값에 따라 랜덤한 salt 값을 생성한다.
  - callback 함수에서 salt 값을 사용하여 `bcrypt.hash()` 메서드를 호출하여 비밀번호 "password"를 해싱한다.
  - `bcrypt.hash()` 메서드가 완료되면, callback 함수에서 출력된 해싱된 값을 볼 수 있다.
