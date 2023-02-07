const bcrypt = require("bcrypt");

// const hashPassword = async (pw) => {
//   const salt = await bcrypt.genSalt(12);
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt); // $2b$12$CglFdXEV5UmbyMVmCtOApu
//   console.log(hash); // $2b$12$CglFdXEV5UmbyMVmCtOApuefAMZdplsPSgn.3rJ870C.ToxB9r16e
// };

// 위와 동일, salt 저장 x
const hashPassword = async (pw) => {
  const hash = await bcrypt.hash(pw, 12);
  console.log(hash);
};

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("LOGGED!!!!");
  } else {
    console.log("SORRY....");
  }
};

// hashPassword("monkey");
// login("monkey", "$2b$12$CglFdXEV5UmbyMVmCtOApuefAMZdplsPSgn.3rJ870C.ToxB9r16e"); // LOGGED!!!!
login(
  "monkey!",
  "$2b$12$CglFdXEV5UmbyMVmCtOApuefAMZdplsPSgn.3rJ870C.ToxB9r16e"
); // SORRY....
