import { Delete, Get, Head, NotFoundException, Patch, Post, Put } from '@nestjs/common'

const DECORATORS = {
    GET: Get,
    HEAD: Head,
    POST: Post,
    PUT: Put,
    PATCH: Patch,
    DELETE: Delete,
} as const

export const Found = (
    path?: Parameters<typeof Get>[0],
    method: keyof typeof DECORATORS = 'GET',
    message = 'Not Found'
): MethodDecorator => {
    return (target, key, descriptor: PropertyDescriptor) => {
        const decorator = DECORATORS[method]

        if (!decorator)
            throw new Error(
                `${method} is not one of ${Object.keys(DECORATORS).reduce(
                    (acc, x, i) =>
                        acc +
                        x +
                        (i < Object.keys(DECORATORS).length - 1
                            ? ', '
                            : i === Object.keys(DECORATORS).length - 1
                              ? ' and '
                              : '')
                )}`
            )

        if (!descriptor) return decorator(path).apply(this, descriptor)

        const { value } = descriptor
        if (!value) return decorator(path).apply(this, [target, key, descriptor])

        // biome-ignore lint/suspicious/noExplicitAny:
        descriptor.value = async function (...args: any[]) {
            const data = await value.apply(this, args)

            switch (data) {
                case null:
                case false:
                case undefined:
                    throw new NotFoundException(message)

                case true:
                    return

                default:
                    return data
            }
        }

        return decorator(path).apply(this, [target, key, descriptor]) as PropertyDescriptor
    }
}
