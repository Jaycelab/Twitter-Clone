import jwt from "jsonwebtoken";

//generate token using user id as payload to check if user is authenticated
// expires in 15 days

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // set cookie with token
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, //prevent XSS attacks, cross-site scripting
    sameSite: "strict", //CSRF attacks, cross-site request forgery
    secure: process.env.NODE_ENV !== "development",
  });
};
