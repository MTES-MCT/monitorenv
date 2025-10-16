export type Vessel = {
  flag?: string
  id: number
  immatriculation?: string
  imo?: string
  mmsi?: string
  shipName?: string
}
// TODO: Search by query in backend
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getVessels = async (query: string | undefined): Promise<Vessel[]> =>
  Promise.resolve([
    {
      flag: 'NP',
      id: 1,
      immatriculation: 'IMMATRICULATION1',
      imo: 'IMO1',
      mmsi: 'MMSI1',
      shipName: 'Nepal'
    },
    {
      flag: 'FRA',
      id: 2,
      immatriculation: 'IMMATRICULATION2',
      imo: 'IMO2',
      mmsi: 'MMSI2',
      shipName: 'France'
    },
    {
      flag: 'GBR',
      id: 3,
      immatriculation: 'IMMATRICULATION3',
      imo: 'IMO3',
      mmsi: 'MMSI3'
    }
  ])
