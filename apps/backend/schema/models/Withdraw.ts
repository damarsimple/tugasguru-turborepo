import { objectType, extendType } from "nexus"
import { Withdraw as WithdrawType } from 'nexus-prisma'


export const Withdraw = objectType({
    name: WithdrawType.$name,
    description: WithdrawType.$description,
    definition(t) {
        t.field(WithdrawType.id)
        t.field(WithdrawType.uuid)
        t.field(WithdrawType.user)
        t.field(WithdrawType.paid)
        t.field(WithdrawType.tax)
        t.field(WithdrawType.status)
        t.field(WithdrawType.amount)
        t.field(WithdrawType.content)
        t.field(WithdrawType.extraContent)

        t.field(WithdrawType.updatedAt)
        t.field(WithdrawType.createdAt)
    }
})


