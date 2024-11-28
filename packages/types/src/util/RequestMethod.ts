namespace RequestMethod {
    export const GET = 'GET' as const
    export type GET = typeof GET

    export const HEAD = 'HEAD' as const
    export type HEAD = typeof HEAD

    export const POST = 'POST' as const
    export type POST = typeof POST

    export const PUT = 'PUT' as const
    export type PUT = typeof PUT

    export const DELETE = 'DELETE' as const
    export type DELETE = typeof DELETE

    export const CONNECT = 'CONNECT' as const
    export type CONNECT = typeof CONNECT

    export const OPTIONS = 'OPTIONS' as const
    export type OPTIONS = typeof OPTIONS

    export const TRACE = 'TRACE' as const
    export type TRACE = typeof TRACE

    export const PATCH = 'PATCH' as const
    export type PATCH = typeof PATCH
}

type RequestMethod = (typeof RequestMethod)[keyof typeof RequestMethod]

export const { GET } = RequestMethod
export type GET = RequestMethod.GET

export const { HEAD } = RequestMethod
export type HEAD = RequestMethod.HEAD

export const { POST } = RequestMethod
export type POST = RequestMethod.POST

export const { PUT } = RequestMethod
export type PUT = RequestMethod.PUT

export const { DELETE } = RequestMethod
export type DELETE = RequestMethod.DELETE

export const { CONNECT } = RequestMethod
export type CONNECT = RequestMethod.CONNECT

export const { OPTIONS } = RequestMethod
export type OPTIONS = RequestMethod.OPTIONS

export const { TRACE } = RequestMethod
export type TRACE = RequestMethod.TRACE

export const { PATCH } = RequestMethod
export type PATCH = RequestMethod.PATCH

export default RequestMethod
