export interface IIndex {
  orderBy?: string
  order?: "asc" | "desc"
  skip?: number,
  take?: number,
  filter?: IFilter
}

export interface IFilter {
  [key: string]: string
}

