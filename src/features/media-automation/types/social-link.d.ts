interface Platform {
    id: number,
    platform: string,
    accountName: string,
    status: 'active' | 'disactive',
    dateConnected: Date
}