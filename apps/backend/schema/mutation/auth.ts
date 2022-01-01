import { arg, extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { Roles, User } from "../models";
import { compare, hash, genSalt } from "bcrypt";
import { signJWT } from "../../api/jwt";
import { saveFile } from "../../api/file";
import { FileUpload } from "graphql-upload";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.boolean("status");
    t.nullable.string("message");
    t.string("token");
    t.nullable.string("refreshToken");
    t.nullable.field("user", { type: User });
  },
});

export const Query = extendType({
  type: "Mutation",
  definition(t) {
    t.field({
      name: "registerValidation",
      type: AuthPayload,
      args: {
        username: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        email: nonNull(stringArg()),
        provinceId: nonNull(intArg()),
        cityId: nonNull(intArg()),
      },
      async resolve(root, args, { prisma }) {
        for (const x of ["email", "username", "phone"]) {
          const userValidation = await prisma.user.findFirst({
            where: {
              //@ts-ignore
              [x]: args[x],
            },
          });
          if (userValidation)
            return {
              status: false,
              message: `${x} is already taken`,
            };
        }

        const city = await prisma.city.findFirst({
          where: {
            id: args.cityId,
          },
        });

        if (city) {
          if (city.provinceId != args.provinceId) {
            return {
              status: false,
              message: "city province not match",
            };
          }
        } else {
          return {
            status: false,
            message: "city not found",
          };
        }

        return {
          status: true,
          message: "validated",
        };
      },
    });
    t.field({
      name: "register",
      type: AuthPayload,
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        email: nonNull(stringArg()),
        address: nonNull(stringArg()),
        roles: nonNull(Roles),
        name: nonNull(stringArg()),
        provinceId: nonNull(intArg()),
        cityId: nonNull(intArg()),
        schoolId: intArg(),
        classtypeId: intArg(),
        identityNumber: stringArg(),
        nisn: stringArg(),

        identityFile: arg({ type: "Upload" }),
      },
      async resolve(root, { identityFile, ...args }, { prisma }) {
        try {
          const salt = await genSalt();

          const user = await prisma.user.create({
            data: {
              ...args,
              nisn: args.nisn == "" ? null : args.nisn,
              password: await hash(args.password, salt),
            },
          });

          if (user) {
            const token = await signJWT(user);
            const refreshToken = "";

            if (identityFile) {
              await saveFile(
                (await identityFile) as FileUpload,
                {
                  prisma,
                  user,
                  isLogged: true,
                  isAdmin: false,
                },
                "IDENTITY_FILE",
                user?.id,
                "User"
              );
            }

            return {
              status: true,
              token,
              refreshToken,
              user,
            };
          }

          return {
            status: false,
            message: "unknow error",
            token: "",
            refreshToken: "",
          };
        } catch (error) {
          console.log(error);

          return {
            status: false,
            message: "Username / Email / Phone already exists",
          };
        }
      },
    });
    t.field({
      name: "login",
      type: AuthPayload,
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, { prisma }) {
        let user;

        for (const x of ["email", "username", "phone"]) {
          user = await prisma.user.findFirst({
            where: {
              [x]: args.username,
            },
          });
          if (user) break;
        }

        if (!user) {
          return {
            status: false,
            message: "User not found",
          };
        }

        const isValid = await compare(args.password, user.password);

        if (isValid) {
          const token = await signJWT(user);
          const refreshToken = "";
          return {
            status: true,
            token,
            refreshToken,
            user,
          };
        }

        return {
          status: false,
          message: "Password is incorrect",
          token: "",
          refreshToken: "",
        };
      },
    });
  },
});
