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


