package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaImageRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaImageModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaImageRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaVigilanceAreaImageRepository(
    private val dbVigilanceAreaImageRepository: IDBVigilanceAreaImageRepository,
    private val dbVigilanceAreaRepository: IDBVigilanceAreaRepository,
) : IVigilanceAreaImageRepository {
    @Transactional
    override fun save(image: ImageEntity): ImageEntity? {
        val vigilanceArea =
            image.vigilanceAreaId.let {
                dbVigilanceAreaRepository.getReferenceById(it!!)
            }

        val imageModel =
            vigilanceArea.let {
                VigilanceAreaImageModel.fromVigilanceAreaImageEntity(image, it)
            }

        return imageModel.let { dbVigilanceAreaImageRepository.save(it).toVigilanceAreaImage() }
    }
}
