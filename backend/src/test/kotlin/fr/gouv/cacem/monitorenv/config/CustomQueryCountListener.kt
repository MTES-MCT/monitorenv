package fr.gouv.cacem.monitorenv.config

import net.ttddyy.dsproxy.ExecutionInfo
import net.ttddyy.dsproxy.QueryInfo
import net.ttddyy.dsproxy.listener.QueryExecutionListener
import java.util.concurrent.atomic.AtomicInteger

class CustomQueryCountListener : QueryExecutionListener {
    private val queryCount = AtomicInteger()

    override fun beforeQuery(
        execInfo: ExecutionInfo,
        queryInfoList: List<QueryInfo>,
    ) {
    }

    override fun afterQuery(
        execInfo: ExecutionInfo,
        queryInfoList: List<QueryInfo>,
    ) {
        queryCount.incrementAndGet()
    }

    fun getQueryCount(): Int = queryCount.get()

    fun resetQueryCount() {
        queryCount.set(0)
    }
}
