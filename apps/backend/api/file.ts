import { join } from "path"
import { createWriteStream } from "fs"
import { FileUpload } from "graphql-upload"
import { FileData } from "@prisma/client";
import { Context } from "./context";

import { v4 as uuidv4 } from 'uuid';


export async function saveFile(file: FileUpload, ctx: Context, context?: string, targetId?: number, targetType?: string): Promise<FileData> {
    const { createReadStream, filename, mimetype, encoding } = file;
    const fileName = `${uuidv4()}-${filename}`;
    const path = join(__dirname, "../uploads/", `${fileName}`)
    return new Promise((res, rej) =>
        createReadStream()
            .pipe(
                createWriteStream(
                    path
                )
            )
            .on("close", async () => {
                const f = await ctx.prisma.fileData.create({
                    data: {
                        fileName,
                        fileType: typeGuesser(mimetype),
                        storage: "LOCAL",
                        mime: mimetype,
                        userId: ctx.user?.id,
                        context,
                        targetId,
                        targetType,
                        referencePath: path,
                    }
                })
                res(f)
            })
            .on("error", rej)

    );
}

const typeGuesser = (mime: string) => {

    if (mime.includes("image")) {
        return "IMAGE"
    }
    if (mime.includes("video")) {
        return "VIDEO"
    }
    if (mime.includes("audio")) {
        return "AUDIO"
    }
    if (mime.includes("pdf")) {
        return "PDF"
    }
    if (mime.includes("word")) {
        return "WORD"
    }
    if (mime.includes("excel")) {
        return "EXCEL"
    }
    if (mime.includes("powerpoint")) {
        return "POWERPOINT"
    }
    if (mime.includes("text")) {
        return "TEXT"
    }
    return "OTHER"

}