import { type ArgumentMetadata, HttpStatus, Injectable, Optional, type PipeTransform } from '@nestjs/common'
import { type ErrorHttpStatusCode, HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util'
import HostID from '@repo/types/util/id/HostID'

export interface ParseHostIDPipeOptions {
    errorHttpStatusCode?: ErrorHttpStatusCode
    // biome-ignore lint/suspicious/noExplicitAny:
    exceptionFactory?: (error: string) => any
    optional?: boolean
}

@Injectable()
class ParseOIDPipe implements PipeTransform<HostID, string> {
    protected exceptionFactory: NonNullable<ParseHostIDPipeOptions['exceptionFactory']>

    constructor(@Optional() protected readonly options?: ParseHostIDPipeOptions) {
        options = options || {}
        const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options

        this.exceptionFactory = exceptionFactory || (error => new HttpErrorByCode[errorHttpStatusCode](error))
    }

    transform(
        value: HostID,
        _metadata: ArgumentMetadata
    ): typeof this.options extends undefined
        ? string
        : NonNullable<typeof this.options>['optional'] extends true
          ? string | undefined
          : string {
        if ((value === undefined || value === null) && this.options?.optional) return undefined as unknown as string

        const id = HostID.get(value)
        if (id === undefined) throw this.exceptionFactory('Validation failed (ObjectId expected)')
        return id
    }
}

export default ParseOIDPipe
