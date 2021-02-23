
interface JwtPayload {
    userId: number,
    username: string,
    iat: number,
    exp: number
}
declare namespace Express {

    interface Response {
        locals: {
            jwtPayload: JwtPayload
        }
    }

}
