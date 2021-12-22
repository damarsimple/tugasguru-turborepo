export const objectSchemaExtractor = <T>(model: T, cb: (e: any) => void) => {
    for (const x in model) {
        if (x.startsWith('$') || x == "user" || x == "userId") continue
        try {
            cb(model[x])
        } catch (error) {
            console.log(x);
        }
    }
}