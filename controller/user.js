import { userRepository } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EntityId } from "redis-om";

// signup
export const signup = async (req, res) => {
  const { firstName, lastName, email, confirmPassword } = req.body;
  const existingUser = await userRepository
    .search()
    .where("email")
    .is.equalTo(email)
    .return.first();

  //check if user already registered with the email
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "A user already registered with the email." });
  }

  if (req.body.password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords don't match." });
  }

  //hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await userRepository.save({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  
  });

  // token generation
  const token = jwt.sign(
    { email: user.email, id: user[EntityId] },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  const data = { id: user[EntityId], ...user };
  res
    .status(201)
    .json({ message: "User created successfull.", result: data, token });
};

// signin
export const signin = async (req, res) => {
  const { email } = req.body;
  const existingUser = await userRepository
    .search()
    .where("email")
    .is.equalTo(email)
    .return.first();
  //check if user exists
  if (!existingUser) {
    return res.status(404).json({ message: "User not found." });
  }
  //check for correct password
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(404).json({ message: "invalid Credentials" });
  }
  //create auth token
  const token = jwt.sign(
    { email: existingUser.email, id: existingUser[EntityId] },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  const data = { id: existingUser[EntityId], ...existingUser };

  res.status(200).json({ result: data, token });
};
