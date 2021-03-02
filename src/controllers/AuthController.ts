import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User, AccessCode } from "../entity";
import config from "../config/config";
import { container } from "../config/di/container"
import Types from "../config/di/types"
import { Mail } from "../config/interfaces"
import accessCodeTemplate from "../templates/accesscode.template"

const mail = container.get<Mail>(Types.MailService)
console.log(mail)

const useRepository = () => {
  const repositories = {}
  return (entity, name: string) => {
    if (repositories[name]) return repositories[name]
    return getRepository(entity)
  }
}
class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email, isActive: true } });
    } catch (error) {
      res.status(401).json({ success: false, data: { error: "incorrect credentials" } });
    }

    //Check if encrypted password match
    console.log(password)
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
    res.status(200).json({ success: true, data: { token, user } })
  };

  static activate = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      console.log("userId =====> ", userId)
      const { activationCode } = req.body
      let accessCode: AccessCode;
      const access = useRepository()(AccessCode, "access")
      const userRepo = useRepository()(User, "users")


      let user = await userRepo.findOne({ id: userId })
      console.log(user)
      if (!user) {
        res.status(400).json({ success: false, data: { error: "invalid user" } });
        return;
      }

      accessCode = await access.findOne({ where: { userId, code: activationCode } })
      if (!accessCode) {
        res.status(400).json({ success: false, data: { error: "invalid or expired activation code" } });
        return;
      }
      user.isActive = true
      userRepo.save(user)
      await access.remove(accessCode)

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      //Send the jwt in the response
      res.status(200).json({ data: { token, user } })

    } catch (error) {
      console.log(error)
      res.status(401).json({ success: false, data: { error: error.toString() } });
    }

  }

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
      const accessCodeRepository = getRepository(AccessCode);

      let user: User;

      user = await userRepository.findOne({ where: { email } });
      if (user) {
        res.status(400).json({ success: false, data: { error: "email already exists" } })
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
      const code = Math.floor(Math.random() * 90000) + 10000;

      let accessCode = new AccessCode()
      accessCode.userId = `${user.id}`
      accessCode.code = code;

      accessCodeRepository.save(accessCode)

      // delete access token after 10 minutes
      setTimeout(() => accessCodeRepository.delete(accessCode), 600000)


      mail.sendMail({ from: "i360chat@chat.com", to: email, subject: "Access Code", text: accessCodeTemplate({ code }) })

      console.log("accessCode", code)
      //Send the jwt in the response
      res.status(200).json({ success: true, data: { user } })
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
