import { objectType, extendType } from "nexus"
import { Transaction as TransactionType } from 'nexus-prisma'


export const Transaction = objectType({
    name: TransactionType.$name,
    description: TransactionType.$description,
    definition(t) {
        t.field(TransactionType.id)
        t.field(TransactionType.uuid)
        t.field(TransactionType.user)
        t.field(TransactionType.target)
        t.field(TransactionType.voucher)
        t.field(TransactionType.paid)
        t.field(TransactionType.paymentUrl)
        t.field(TransactionType.paymentMethod)
        t.field(TransactionType.tax)
        t.field(TransactionType.status)
        t.field(TransactionType.discount)
        t.field(TransactionType.amount)
        t.field(TransactionType.purchaseId)
        t.field(TransactionType.purchaseType)
        t.field(TransactionType.description)
        t.field(TransactionType.content)
        t.field(TransactionType.extraContent)

        t.field(TransactionType.updatedAt)
        t.field(TransactionType.createdAt)
    }
})

