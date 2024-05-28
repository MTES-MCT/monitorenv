package fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors


interface IDataMerger<T> {

    fun merge(source: T, target: T): T
}
