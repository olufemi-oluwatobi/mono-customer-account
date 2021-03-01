import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/user";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.status(200).json({ data: { token } })
  };

  static signup = async (req: Request, res: Response) => {
    try {
      //Check if username and password are set
      let { email, password } = req.body;
      console.log(req.body)
      if (!(email && password)) {
        res.status(400).send();
      }

      //Get user from database
      const userRepository = getRepository(User);
      let user: User;

      user = await userRepository.findOne({ where: { email } });
      if (user) {
        res.status(400).json({ success: false, data: "email alread exists" })
        return
      }
      user = new User()

      user.email = email;
      user.password = password;
      user.role = "basic";
      user.hashPassword()

      user = await userRepository.save(user)
      //Check if encrypted password match
      if (!user) {
        res.status(500).json({ success: false, data: "failed to create user" })
        return
      }


      //Send the jwt in the response
      res.status(200).json({ data: { user } })
    } catch (error) {
      console.log(error)
      res.status(401).json({ success: false, data: { error: error.toString() } });
    }

  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
