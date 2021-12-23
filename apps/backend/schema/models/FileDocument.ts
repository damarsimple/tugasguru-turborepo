import { objectType, extendType } from "nexus"
import { FileDocument as FileDocumentType } from 'nexus-prisma'


export const FileDocument = objectType({
    name: FileDocumentType.$name,
    description: FileDocumentType.$description,
    definition(t) {
        t.field(FileDocumentType.id)
        t.field(FileDocumentType.user)
        t.field(FileDocumentType.referencePath)
        t.field(FileDocumentType.fileType)
        t.field(FileDocumentType.fileUrl)
        t.field(FileDocumentType.targetId)
        t.field(FileDocumentType.targetType)
        t.field(FileDocumentType.context)
        t.field(FileDocumentType.originalSize)
        t.field(FileDocumentType.compressedSize)
        t.field(FileDocumentType.extensions)
        // t.field(FileDocumentType.compressMetadata)
        t.field(FileDocumentType.fileName)
        t.field(FileDocumentType.storage)
        t.field(FileDocumentType.updatedAt)
        t.field(FileDocumentType.createdAt)
    }
})

