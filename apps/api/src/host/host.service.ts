import { BadRequestException, Injectable } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import Hash from '@repo/types/util/Hash'

export class HostDetailsDTO {
    @ApiProperty()
    user!: string

    @ApiProperty()
    mac!: string
}

@Injectable()
export class HostService {
    hash(host: HostDetailsDTO) {
        if (typeof host.user !== 'string') throw new BadRequestException('User is not a string.')
        if (typeof host.mac !== 'string') throw new BadRequestException('MAC address is not a string.')
        if (!/^[0-9a-fA-F]{2}((:[0-9a-fA-F]{2}){5}|(-[0-9a-fA-F]{2}){5})$/.test(host.mac))
            throw new BadRequestException(`'${host.mac}' is not a valid MAC address.`)

        return Hash({ user: host.user, mac: host.mac.toUpperCase().replaceAll('-', ':') })
    }
}
