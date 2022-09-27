import { Request } from "express"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export type $Request = Request & {
    locals: {
        orm: DataSource
    }
    user: User,
}