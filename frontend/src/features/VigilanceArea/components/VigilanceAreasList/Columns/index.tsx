import { DateCell } from '@components/Table/DateCell'
import { LocalizeCell } from '@components/Table/LocalizeCell'
import { VigilanceArea } from '@features/VigilanceArea/types'

import { EditCell } from '../Rows/EditCell'
import { FrequencyCell } from '../Rows/FrequencyCell'
import { StatusCell } from '../Rows/StatusCell'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0) => [
  {
    accessorFn: row => row.startDatePeriod,
    cell: info => <DateCell date={info.getValue()} withoutTime />,
    enableSorting: true,
    header: () => 'Début',
    id: 'startDatePeriod',
    size: 92 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.endDatePeriod,
    cell: info => <DateCell date={info.getValue()} withoutTime />,
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDatePeriod',
    size: 92 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.frequency,
    cell: info => <FrequencyCell frequency={info.getValue()} />,
    enableSorting: true,
    header: () => 'Récurrence',
    id: 'frequency',
    size: 160 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => {
      const frequencyA = rowA.original.frequency
      const frequencyB = rowB.original.frequency

      return VigilanceArea.FrequencyLabel[frequencyA].localeCompare(VigilanceArea.FrequencyLabel[frequencyB])
    }
  },
  {
    accessorFn: row => row.name,
    cell: info => <span title={info.getValue()}>{info.getValue()}</span>,
    enableSorting: true,
    header: () => 'Nom de la zone',
    id: 'name',
    size: 272 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.themes?.join(', '),
    cell: info => <span title={info.getValue()}>{info.getValue()}</span>,
    enableSorting: true,
    header: () => 'Thématiques',
    id: 'themes',
    size: 260 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.comments,
    cell: info => <span title={info.getValue()}>{info.getValue()}</span>,
    enableSorting: true,
    header: () => 'Commentaire',
    id: 'comments',
    size: 397 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 110 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.isDraft,
    cell: info => <StatusCell isDraft={info.getValue()} />,
    enableSorting: true,
    header: () => 'Statut',
    id: 'isDraft',
    size: 135 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.createdBy,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Créée par',
    id: 'createdBy',
    size: 100 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.geom,
    cell: info => <LocalizeCell geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 52 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.id,
    cell: info => <EditCell id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 52 + legacyFirefoxOffset
  }
]
