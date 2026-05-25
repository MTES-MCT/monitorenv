import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { PeriodsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/PeriodsCell'

import { ActionsCell } from '../Cells/ActionsCell'
import { NameCell } from '../Cells/NameCell'
import { TagsCell } from '../Cells/TagsCell'
import { ThemesCell } from '../Cells/ThemesCells'
import { ValidationDateCell } from '../Cells/ValidationDateCell'
import { VisibilityCell } from '../Cells/VisibilityCell'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching: boolean = false) => [
  {
    accessorFn: row => row.name,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <NameCell vigilanceArea={row.original} />),
    enableSorting: true,
    header: () => 'Nom de la zone',
    id: 'name',
    minSize: 350 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.periods,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <PeriodsCell periods={info.getValue()} />),
    enableSorting: true,
    header: () => 'Période(s) de vigilance',
    id: 'periods',
    size: 220 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.themes,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ThemesCell themes={info.getValue()} />),
    enableSorting: true,
    header: () => 'Thématiques',
    id: 'themes',
    minSize: 275 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.tags,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <TagsCell tags={info.getValue()} />),
    enableSorting: true,
    header: () => 'Tags',
    id: 'tags',
    minSize: 275 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : (info.getValue() ?? '-')),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 144 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.validatedAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ValidationDateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Validée le',
    id: 'validatedAt',
    size: 172 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.visibility,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <VisibilityCell visibility={info.getValue()} />),
    enableSorting: true,
    header: () => 'Visibilité',
    id: 'visibility',
    size: 106 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.geom,
    cell: ({ row }) =>
      isFetching ? <StyledSkeletonRow /> : <ActionsCell geom={row.original.geom} id={row.original.id} />,
    enableSorting: false,
    header: () => '',
    id: 'actions',
    size: 82 + legacyFirefoxOffset
  }
]
