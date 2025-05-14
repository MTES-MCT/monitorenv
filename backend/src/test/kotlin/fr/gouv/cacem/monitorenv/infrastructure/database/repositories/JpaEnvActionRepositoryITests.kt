package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.CustomQueryCountListener
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.UUID

class JpaEnvActionRepositoryITests : AbstractDBTests() {
    @Autowired
    private val customQueryCountListener: CustomQueryCountListener? = null

    @Autowired
    private lateinit var jpaEnvActionRepository: JpaEnvActionRepository

    private val objectMapper: ObjectMapper = ObjectMapper()

    @BeforeEach
    fun setUp() {
        customQueryCountListener!!.resetQueryCount() // Reset the count before each test
    }

    @Test
    fun `findById() should return the appropriate envAction`() {
        // Given
        val id = UUID.fromString("16eeb9e8-f30c-430e-b36b-32b4673f81ce")

        // When
        val envActionEntity = jpaEnvActionRepository.findById(id)

        // Then
        assertThat(envActionEntity).isNotNull()
        assertThat(envActionEntity?.id).isEqualTo(id)
    }

    @Test
    fun `findById() should return null when id does not exist`() {
        // Given
        val id = UUID.randomUUID()

        // When
        val envActionEntity = jpaEnvActionRepository.findById(id)

        // Then
        assertThat(envActionEntity).isNull()
    }

    @Test
    fun `save() should return the updated entity`() {
        // Given
        val id = UUID.fromString("e2257638-ddef-4611-960c-7675a3254c38")
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val observationsByUnit = "observationsByUnit"

        val anEnvAction =
            anEnvAction(
                objectMapper,
                id,
                today,
                tomorrow,
                observationsByUnit,
                controlPlans =
                    listOf(
                        EnvActionControlPlanEntity(
                            themeId = 11,
                            subThemeIds = listOf(51),
                            tagIds = listOf(),
                        ),
                    ),
            )

        // When
        val envActionEntity = jpaEnvActionRepository.save(anEnvAction)

        // Then
        assertThat(envActionEntity).isEqualTo(anEnvAction)
        assertThat(envActionEntity.controlPlans?.size).isEqualTo(1)
    }

    @Test
    fun `getRecentControlsActivity() should return the appropriate controls`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T23:59:00Z").toInstant(),
                controlUnitIds = null,
                administrationIds = null,
                themeIds = null,
                geometry = null,
            )

        // Then
        assertThat(recentControlsActivity.size).isEqualTo(3)
        recentControlsActivity.forEach { control ->
            if (control.actionStartDateTimeUtc != null) {
                assertThat(control.actionStartDateTimeUtc)
                    .isAfterOrEqualTo(
                        ZonedDateTime.parse("2022-01-01T10:54:00Z"),
                    )
                assertThat(control.actionStartDateTimeUtc)
                    .isBeforeOrEqualTo(
                        ZonedDateTime.parse("2050-08-08T23:59:00Z"),
                    )
            }
        }

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    fun `getRecentControlsActivity() should return controls when controlUnitIds filter is set`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                controlUnitIds = listOf(10002),
                administrationIds = null,
                themeIds = null,
                geometry = null,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(1)
        recentControlsActivity.forEach { control ->
            assertThat(control.controlUnitsIds).contains(10002)
        }
    }

    @Test
    fun `getRecentControlsActivity() should return controls when administrationIds filter is set`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                controlUnitIds = null,
                administrationIds = listOf(1005),
                themeIds = null,
                geometry = null,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(1)
        recentControlsActivity.forEach { control ->
            assertThat(control.administrationIds).contains(1005)
        }
    }

    @Test
    fun `getRecentControlsActivity() should return controls when themeIds filter is set`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                controlUnitIds = null,
                administrationIds = null,
                themeIds = listOf(112),
                geometry = null,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(1)
        recentControlsActivity.forEach { control ->

            assertThat(control.themesIds).containsExactly(112)
            assertThat(control.subThemesIds).containsExactlyInAnyOrder(318, 333)
        }
    }

    @Test
    fun `getRecentControlsActivity() should return controls when geometry filter is set`() {
        // When
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-1.3194349310993505 49.2881368355807, -1.3041109511675004 49.104771787724815, -1.2343383652895725 48.92623371857863, -1.1127984948119385 48.75947803006014, -0.9441620487967088 48.61106650213716, -0.7349096312918407 48.48689177559362, -0.4930826953519396 48.39192203684982, -0.22797451450706563 48.32998012995483, 0.050226952527292444 48.303570175720154, 0.3308305793901842 48.3137624215766, 0.6030529260655955 48.36014365080615, 0.8564326404348402 48.44083635582248, 1.0812324821716912 48.55258543308199, 1.2688135194274037 48.69090683567808, 1.4119671181368982 48.85028885577469, 1.5051919657832329 49.0244338610556, 1.544905483752455 49.20652661462876, 1.5295815038206049 49.389514852605686, 1.4598089179426768 49.566388505457525, 1.3382690474650432 49.730445613952725, 1.1696326014498135 49.87553529080236, 0.9603801839449452 49.99627064903834, 0.718553248005044 50.088207101953174, 0.45344506716017 50.14798354537294, 0.17524360012581208 50.17342547233457, -0.10536002673708089 50.16360997668167, -0.377582373412491 50.11889293126555, -0.6309620877817358 50.04089853717042, -0.8557619295185858 49.932471162897315, -1.0433429667742995 49.79758918828426, -1.1864965654837938 49.641240686497525, -1.2797214131301284 49.46926141379387, -1.3194349310993505 49.2881368355807)))"
        val geometry = wktReader.read(multipolygonString) as MultiPolygon

        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                controlUnitIds = null,
                administrationIds = null,
                themeIds = null,
                geometry = geometry,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(2)
        recentControlsActivity.forEach { control -> assertThat(control.geom).isNotNull() }
    }

    @Test
    fun `getRecentControlsActivity() should return controls when multiple filters are set`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                controlUnitIds = listOf(10002, 10018),
                administrationIds = listOf(1005, 1008),
                themeIds = null,
                geometry = null,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(2)
        recentControlsActivity.forEach { control ->
            assertThat(control.controlUnitsIds).containsAnyOf(10002, 10018)
            assertThat(control.administrationIds).containsAnyOf(1005, 1008)
        }
    }
}
