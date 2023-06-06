import styled from 'styled-components'

function SkeletonRow() {
  return <StyledSkeletonRow />
}

export const SkeletonColumns = [
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: () => <SkeletonRow />,
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 180
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: () => <SkeletonRow />,
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 180
  },
  {
    accessorFn: row => row.missionSource,
    cell: () => <SkeletonRow />,
    enableSorting: true,
    header: () => 'Origine',
    id: 'missionSource',
    size: 90
  },
  {
    accessorFn: row => row.controlUnits,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => 'Unité (Administration)',
    id: 'unitAndAdministration',
    maxSize: 280,
    minSize: 230
  },
  {
    accessorFn: row => row.missionTypes,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 90
  },
  {
    accessorFn: row => row.facade,
    cell: () => <SkeletonRow />,
    enableSorting: true,
    header: () => 'Facade',
    id: 'seaFront',
    size: 100
  },
  {
    accessorFn: row => row.envActions,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    maxSize: 280,
    minSize: 100,
    size: 230
  },
  {
    accessorFn: row => row.envActions,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => 'Nbre contrôles',
    id: 'controls',
    size: 110
  },
  {
    accessorFn: row => row.isClosed,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => 'Statut',
    id: 'status',
    size: 120
  },
  {
    accessorFn: row => row.geom,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 55
  },
  {
    accessorFn: row => row.id,
    cell: () => <SkeletonRow />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 100
  }
]

const StyledSkeletonRow = styled.div`
  height: 30px;
  position: relative;
  overflow: hidden;
  background: ${p => p.theme.color.gainsboro};
  &:before {
    content: '';
    display: block;
    position: absolute;
    left: -150px;
    top: 0;
    height: 100%;
    width: 150px;
    background: linear-gradient(to right, transparent 0%, ${p => p.theme.color.white} 50%, transparent 100%);
    animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  @keyframes load {
    from {
      left: -150px;
    }
    to {
      left: 100%;
    }
  }
`
