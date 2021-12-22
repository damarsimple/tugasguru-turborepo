import { objectType, extendType } from "nexus"
import { Voucher as VoucherType } from 'nexus-prisma'


export const Voucher = objectType({
    name: VoucherType.$name,
    description: VoucherType.$description,
    definition(t) {
        t.field(VoucherType.id)
        t.field(VoucherType.name)
        t.field(VoucherType.code)
        t.field(VoucherType.percentage)

        t.field(VoucherType.expiredAt)
        t.field(VoucherType.updatedAt)
        t.field(VoucherType.createdAt)
    }
})


export const VoucherQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('vouchers', {
            type: Voucher,
            resolve: (_, args, ctx) => {
                return ctx.prisma.voucher.findMany()
            }
        })
    },
})


