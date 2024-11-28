import { type ArgumentMetadata, HttpStatus, Injectable, Optional, type PipeTransform } from '@nestjs/common'
import { type ErrorHttpStatusCode, HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util'
import Integer from '@repo/types/number/Integer'
import Natural from '@repo/types/number/Natural'

export interface ParseNatPipeOptions {
    errorHttpStatusCode?: ErrorHttpStatusCode
    // biome-ignore lint/suspicious/noExplicitAny:
    exceptionFactory?: (error: string) => any
    optional?: boolean
}

@Injectable()
class ParseNatPipe implements PipeTransform<string> {
    protected exceptionFactory: NonNullable<ParseNatPipeOptions['exceptionFactory']>

    constructor(@Optional() protected readonly options?: ParseNatPipeOptions) {
        options = options || {}
        const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options

        this.exceptionFactory = exceptionFactory || (error => new HttpErrorByCode[errorHttpStatusCode](error))
    }

    async transform(
        value: unknown,
        _metadata: ArgumentMetadata
    ): Promise<
        typeof this.options extends undefined
            ? Natural
            : NonNullable<typeof this.options>['optional'] extends true
              ? Natural | undefined
              : Natural
    > {
        if ((value === undefined || value === null) && this.options?.optional) return undefined as unknown as Natural

        switch (typeof value) {
            // biome-ignore lint/suspicious/noFallthroughSwitchClause:
            case 'string': {
                if (!/^-?\d+$/.test(value)) {
                    throw this.exceptionFactory('Validation failed (integer string expected)')
                }
                value = Number.parseInt(value, 10)
            }

            case 'number': {
                if (!Integer.is(value)) throw this.exceptionFactory('Validation failed (integer expected)')
                if (!Natural.is(value)) throw this.exceptionFactory('Validation failed (natural number expected)')

                return value
            }

            default:
                throw this.exceptionFactory('Validation failed (string or number expected)')
        }
    }
}

export default ParseNatPipe
