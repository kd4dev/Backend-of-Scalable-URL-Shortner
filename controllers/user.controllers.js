import { getUserByEmail } from "../services/user.service.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { createUserToken } from "../utils/token.js";
import {
  signupPostRequestSchema,
  loginPostRequestSchema,
} from "../validations/request.validation.js";

export const signupController = async function (req, res) {
  const validationResult = await signupPostRequestSchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }
  const { firstname, lastname, email, password } = validationResult.data;
  /*
        if (!firstname)
            return res.status(400).josn({ error: "firstname is required" });
    */
  // -->we will do all auth validaton part with zod that if like firstname exist or not and all others like valid email or not

  const existingUser = await getUserByEmail(email);
  if (existingUser)
    return res.status(400).json({ error: `User with email:${email} exist!` });

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const user = await createUser({
    email,
    firstname,
    lastname,
    salt,
    password: hashedPassword,
  });
};

export const loginController = async function (req, res) {
  const validationResult = await loginPostRequestSchema.safeParseAsync(
    req.body
  );
  //safeParseAsynch-->error,data,true ya false  return krta he
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;
  const user = await getUserByEmail(email);
  if (!user) {
    return res
      .status(404)
      .json({ error: `User with email:${email} dont exists` });
  }

  const { password: hashedPassword } = await hashPasswordWithSalt(
    password,
    user.salt
  );
  if (user.password !== hashedPassword) {
    return res.status(400).json({ error: `Invalid password` });
  }
  // const payload={
  //     id:user.id
  // }

  const token =await createUserToken({id:user.id});
  return res.json({ token });
};
