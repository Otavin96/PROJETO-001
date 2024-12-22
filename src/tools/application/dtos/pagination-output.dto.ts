export type PaginationOutputDto<Item> = {
  items: Item[]
  total: number
  current_page: number
  per_page: number
  last_page: number
}

export class PaginationOutputMapper {
  static toOutput<item = any>(
    items: item[],
    result: any,
  ): PaginationOutputDto<item> {
    return {
      items,
      total: result.total,
      current_page: result.current_page,
      per_page: result.per_page,
      last_page: Math.ceil(result.total / result.per_page),
    }
  }
}
