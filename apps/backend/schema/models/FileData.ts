import { objectType, extendType } from "nexus"
import { FileData as FileDataType } from 'nexus-prisma'


export const FileData = objectType({
    name: FileDataType.$name,
    description: FileDataType.$description,
    definition(t) {
        t.field(FileDataType.id)
        t.field(FileDataType.user)
        t.field(FileDataType.referencePath)
        t.field(FileDataType.targetId)
        t.field(FileDataType.targetType)
        t.field(FileDataType.context)
        t.field(FileDataType.originalSize)
        t.field(FileDataType.compressedSize)
        t.field(FileDataType.mime)
        // t.field(FileDataType.compressMetadata)
        t.field(FileDataType.fileName)
        t.field(FileDataType.storage)
        t.field(FileDataType.updatedAt)
        t.field(FileDataType.createdAt)
    }
})

